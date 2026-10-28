import { useMemo } from "react";

import {
  EntityRef,
  ResolvedEdge,
  expands,
  resolveEdge,
} from "../../relationships/edges";
import {
  ALLOWED_TYPES,
  isTerminalProjectStatus,
  isTerminalTaskStatus,
} from "../../relationships/display-rules";
import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { useProjectsState } from "../use-projects/state-context";
import { useTasksState } from "../use-tasks/state-context";
import { useRelationshipsState } from "./state-context";

export interface RelationshipNode {
  entity: EntityRef;
  /** how we got here; null on the root, which nothing points to */
  edge: ResolvedEdge | null;
  children: RelationshipNode[];
  /**
   * This node has neighbours the tree is not showing, because the walk ran
   * out of depth or looped back on itself. An edge that simply does not
   * expand is not truncated - stopping there is the design, not a limit - so
   * this is safe to render as "there is more, click through".
   */
  truncated: boolean;
}

export interface RelationshipTreeOptions {
  /** how many levels of children to walk. 1 is the root's neighbours only. */
  depth?: number;
  /** narrows the root's neighbours only; levels below it are never filtered */
  priority?: "primary" | "secondary";
}

const DEFAULT_DEPTH = 2;

const keyOf = (ref: EntityRef) => `${ref.type}:${ref.id}`;

export type RelationshipIndex = Map<string, IRelationship[]>;

/**
 * Every relationship filed under both of the entities it touches, so a walk
 * is a lookup instead of two scans of the whole table per node.
 */
export const buildIndex = (
  relationships: IRelationship[]
): RelationshipIndex => {
  const index: RelationshipIndex = new Map();

  const add = (key: string, relationship: IRelationship) => {
    const existing = index.get(key);
    if (existing) {
      existing.push(relationship);
    } else {
      index.set(key, [relationship]);
    }
  };

  relationships.forEach((relationship) => {
    const source = `${relationship.source_type}:${relationship.source_id}`;
    const target = `${relationship.target_type}:${relationship.target_id}`;

    add(source, relationship);
    // a row joining something to itself is one edge, not two
    if (target !== source) {
      add(target, relationship);
    }
  });

  return index;
};

const matchesPriority = (
  rootType: RelationshipEntityType,
  neighbourType: RelationshipEntityType,
  priority?: "primary" | "secondary"
): boolean =>
  !priority || ALLOWED_TYPES[rootType][priority].includes(neighbourType);

/** the order neighbours read in, kept the same as the old flat selector */
const sortOrder = (
  parentType: RelationshipEntityType,
  neighbourType: RelationshipEntityType
): number =>
  Object.values(ALLOWED_TYPES[parentType]).flat().indexOf(neighbourType);

export interface WalkContext {
  index: RelationshipIndex;
  /** ids of tasks that are still live - a done task is history */
  liveTasks: Set<number>;
  liveProjects: Set<number>;
}

const isLive = (ref: EntityRef, context: WalkContext): boolean => {
  if (ref.type === RelationshipEntityType.Task) {
    return context.liveTasks.has(ref.id);
  }

  if (ref.type === RelationshipEntityType.Project) {
    return context.liveProjects.has(ref.id);
  }

  return true;
};

/**
 * Walks the relationship graph into a finite tree.
 *
 * Everything that makes the walk terminate lives here rather than in the
 * components: an edge is only descended through when its type expands, the
 * depth budget is a hard backstop, and an entity already on the path is not
 * entered again. By the time a component sees a node, every decision about
 * how deep to go has been made.
 */
export const walk = (
  ref: EntityRef,
  edge: ResolvedEdge | null,
  remaining: number,
  ancestors: ReadonlySet<string>,
  context: WalkContext,
  priority?: "primary" | "secondary"
): RelationshipNode => {
  const path = new Set(ancestors);
  path.add(keyOf(ref));

  const rows = context.index.get(keyOf(ref)) ?? [];

  const edges = rows
    .map((row) => resolveEdge(row, ref))
    .filter((resolved): resolved is ResolvedEdge => resolved !== null)
    // anything already on the path is where we came from, not a neighbour
    // worth showing again. Dropping it rather than marking it truncated is
    // what stops every node listing its own parent back at you, and stops a
    // leaf looking like it has more behind it when all it has is the edge we
    // arrived on.
    .filter((resolved) => !path.has(keyOf(resolved.other)))
    .filter((resolved) =>
      matchesPriority(ref.type, resolved.other.type, priority)
    )
    .filter((resolved) => isLive(resolved.other, context))
    .sort(
      (a, b) =>
        sortOrder(ref.type, a.other.type) - sortOrder(ref.type, b.other.type)
    );

  if (remaining <= 0) {
    return { entity: ref, edge, children: [], truncated: edges.length > 0 };
  }

  const children = edges.map((resolved) => {
    // stopping at an edge that does not expand is the design, not a
    // truncation, so it gets no "there is more" affordance
    if (!expands(resolved.type)) {
      return {
        entity: resolved.other,
        edge: resolved,
        children: [],
        truncated: false,
      };
    }

    // priority narrows the root's neighbours only
    return walk(resolved.other, resolved, remaining - 1, path, context);
  });

  return { entity: ref, edge, children, truncated: false };
};

/**
 * The bounded, cycle-free tree of everything worth showing around an entity.
 *
 * Replaces the pattern where each Related* component looked up its own
 * neighbours and rendered more of itself - which made React's render the
 * graph traversal, and left nothing in a position to know how deep it was.
 */
export const useRelationshipTree = (
  root: EntityRef,
  { depth = DEFAULT_DEPTH, priority }: RelationshipTreeOptions = {}
): RelationshipNode => {
  const { data: relationships, isLoading } = useRelationshipsState();
  const { data: tasks } = useTasksState();
  const { data: projects } = useProjectsState();

  // callers pass a fresh { id, type } literal every render, so the memo has
  // to key on the two values rather than the object
  const { id: rootId, type: rootType } = root;

  return useMemo(() => {
    const entity: EntityRef = { id: rootId, type: rootType };
    const empty: RelationshipNode = {
      entity,
      edge: null,
      children: [],
      truncated: false,
    };

    if (isLoading || !relationships) {
      return empty;
    }

    const context: WalkContext = {
      index: buildIndex(relationships),
      liveTasks: new Set(
        (tasks ?? [])
          .filter((task) => !isTerminalTaskStatus(task.status))
          .map((task) => task.id)
      ),
      liveProjects: new Set(
        (projects ?? [])
          .filter((project) => !isTerminalProjectStatus(project.status))
          .map((project) => project.id)
      ),
    };

    return walk(entity, null, depth, new Set(), context, priority);
  }, [
    relationships,
    isLoading,
    tasks,
    projects,
    rootId,
    rootType,
    depth,
    priority,
  ]);
};
