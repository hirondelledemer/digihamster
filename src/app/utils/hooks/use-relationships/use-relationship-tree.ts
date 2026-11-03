import { useMemo } from "react";

import {
  EntityRef,
  ResolvedEdge,
  expands,
  isWorthShowingUnder,
  matchesView,
  nests,
  resolveEdge,
  viewOrder,
} from "../../relationships/edges";
import {
  hidesCompletedHabits,
  isHiddenTaskUnder,
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
import { ITask, TaskStatus } from "../../types/task";
import { IProject } from "../../types/project";
import { IHabitWithLogs } from "../../types/habit";
import { useHabitsNewState } from "../use-habits-new/state-context";
import { getHabitLogForADay } from "../../habits/habit-log";
import { toBackendDate } from "#utils/date";

export interface RelationshipNode {
  entity: EntityRef;

  /**
   * The relationship row this node was reached through, read from the parent's
   * side: the row id (what the unlink button deletes), the verb (what `expands`
   * reads to decide whether to descend), and which end the parent stands on
   * (which of the two labels applies). Null on the root, which nothing points to.
   *
   * `edge.other` is always this node's own `entity` - resolveEdge returns it so
   * the parent can find the far end, and the walk then uses it as the child.
   */
  edge: ResolvedEdge | null;
  children: RelationshipNode[];
  /**
   * The neighbour types sitting behind this entity, for the row of little
   * icons that hints at what is there. Already filtered the same way children
   * are - so the thing you are looking at never shows up as a hint underneath
   * one of its own neighbours.
   */
  summary: RelationshipEntityType[];
  /**
   * This node has neighbours the tree is not showing, because the walk ran
   * out of depth or looped back on itself. An edge that simply does not
   * expand is not truncated - stopping there is the design, not a limit - so
   * this is safe to render as "there is more, click through".
   */
  truncated: boolean;
  depth: number;
}

export interface RelationshipTreeOptions {
  /** how many levels of children to walk. 1 is the root's neighbours only. */
  depth?: number;
  /** narrows the root's neighbours only; levels below it are never filtered */
  priority?: "primary" | "secondary";
  /**
   * The day the panel is being read against - the start of the event it was
   * opened from, typically.
   *
   * It has to come from the caller. The tree's root is whichever entity this
   * column happens to show, which in a navigator is as often a location or a
   * task as it is the event you clicked, so there is nothing here to derive
   * it from.
   *
   * Leaving it out means no day is in play - a note's panel is not "about"
   * any particular date - and the rules that need one do not fire. It does
   * not mean today.
   */
  on?: Date;
}

const DEFAULT_DEPTH = 2;

const keyOf = (ref: EntityRef) => `${ref.type}:${ref.id}`;

export type RelationshipIndex = Map<string, IRelationship[]>;

/**
 * Built once per version of the relationships array rather than once per
 * caller.
 *
 * The index is the same for everybody, but every consumer builds its own
 * inside its own useMemo - and a day view renders one of those per calendar
 * event, so a screenful of events meant a screenful of passes over the whole
 * table. The reducer always returns a fresh array and never mutates in place,
 * so the array's identity is exactly the right cache key, and the old index
 * falls out of the map with the old array.
 */
const indexCache = new WeakMap<IRelationship[], RelationshipIndex>();

/**
 * Every relationship filed under both of the entities it touches, so a walk
 * is a lookup instead of two scans of the whole table per node.
 */
export const buildIndex = (
  relationships: IRelationship[]
): RelationshipIndex => {
  const cached = indexCache.get(relationships);
  if (cached) {
    return cached;
  }

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

  indexCache.set(relationships, index);

  return index;
};

/**
 * The same WeakMap trick as `indexCache`, for the same reason.
 *
 * These are derived from a whole store, but they were being rebuilt inside
 * every consumer's useMemo - and a day view mounts one per calendar event, so
 * a screenful of events meant a screenful of passes over every task, project
 * and habit. The stores hand back a fresh array on every change and never
 * mutate in place, so the array identity is the cache key.
 *
 * The habit map additionally depends on which day is being asked about, so it
 * is cached one level deeper: array identity, then day.
 */
const taskStatusCache = new WeakMap<ITask[], Map<number, TaskStatus>>();
const liveProjectCache = new WeakMap<IProject[], Set<number>>();
const habitCompletionCache = new WeakMap<
  IHabitWithLogs[],
  Map<string, Map<number, boolean>>
>();

const taskStatusById = (tasks: ITask[]): Map<number, TaskStatus> => {
  const cached = taskStatusCache.get(tasks);
  if (cached) {
    return cached;
  }

  const byId = new Map<number, TaskStatus>();
  tasks
    .filter((task) => !isTerminalTaskStatus(task.status))
    .forEach((task) => byId.set(task.id, task.status));

  taskStatusCache.set(tasks, byId);

  return byId;
};

const liveProjectIds = (projects: IProject[]): Set<number> => {
  const cached = liveProjectCache.get(projects);
  if (cached) {
    return cached;
  }

  const ids = new Set(
    projects
      .filter((project) => !isTerminalProjectStatus(project.status))
      .map((project) => project.id)
  );

  liveProjectCache.set(projects, ids);

  return ids;
};

const NO_DAY = new Map<number, boolean>();

const habitCompletionOn = (
  habits: IHabitWithLogs[],
  on: Date | undefined
): Map<number, boolean> => {
  // no day in play, so there is no such thing as "already done today" and
  // every habit stays visible
  if (!on) {
    return NO_DAY;
  }

  let byDay = habitCompletionCache.get(habits);
  if (!byDay) {
    byDay = new Map();
    habitCompletionCache.set(habits, byDay);
  }

  const key = toBackendDate(on);
  const cached = byDay.get(key);
  if (cached) {
    return cached;
  }

  const completed = new Map<number, boolean>();
  habits.forEach((habit) =>
    completed.set(habit.id, !!getHabitLogForADay(habit, on)?.completed)
  );

  byDay.set(key, completed);

  return completed;
};

export interface WalkContext {
  index: RelationshipIndex;
  /**
   * Status by id, for the tasks that survived the global rule. A task that is
   * terminal everywhere never makes it in, so a miss here already means "do
   * not render"; the status is what the per-parent rules read.
   */
  taskStatusById: Map<number, TaskStatus>;
  /**
   * Whether each habit was already logged complete on the day in play. Empty
   * when no day is in play, which is why a miss has to mean "show it".
   */
  habitCompletedOnDay: Map<number, boolean>;
  /** ids of projects that are still live */
  liveProjects: Set<number>;
}

/**
 * Whether a neighbour earns its space, read from where the walk actually
 * stands rather than from the root.
 *
 * Two rules stacked, and they are different kinds of thing. The context maps
 * carry the global one - a cancelled task is history no matter who points at
 * it, so it never made it into `taskStatusById` at all. `parentType`
 * then applies the local one: a place answers "what could I do here", so a
 * task you have already done drops out underneath a location and stays
 * visible everywhere else.
 *
 * The parent has to be an argument. The same location renders under an event,
 * under a task and as its own root, and the answer has to be the same in all
 * three - which it cannot be if it was decided once per tree.
 */
const isLive = (
  parentType: RelationshipEntityType,
  ref: EntityRef,
  context: WalkContext
): boolean => {
  if (ref.type === RelationshipEntityType.Task) {
    const status = context.taskStatusById.get(ref.id);

    // absent means the global rule already dropped it, or the store has not
    // got it - either way there is nothing to render
    if (status === undefined) {
      return false;
    }

    return !isHiddenTaskUnder(parentType, status);
  }

  if (ref.type === RelationshipEntityType.Habit) {
    if (!hidesCompletedHabits(parentType)) {
      return true;
    }

    // Unlike tasks, no habit is ever globally dropped, so a miss is a habit
    // the store has not loaded yet - or a panel with no day in play at all.
    // Both have to read as "show it": hiding on a miss would blink every
    // habit off the panel while the store loads.
    return !context.habitCompletedOnDay.get(ref.id);
  }

  if (ref.type === RelationshipEntityType.Project) {
    return context.liveProjects.has(ref.id);
  }

  return true;
};

/**
 * The neighbour types behind an entity, filtered exactly as children are.
 *
 * One index lookup and no recursion, so it is cheap enough to attach to every
 * node including the ones the walk decided not to descend into.
 */
const neighbourTypesOf = (
  ref: EntityRef,
  path: ReadonlySet<string>,
  context: WalkContext
): RelationshipEntityType[] =>
  (context.index.get(keyOf(ref)) ?? [])
    .map((row) => resolveEdge(row, ref))
    .filter((resolved): resolved is ResolvedEdge => resolved !== null)
    .filter((resolved) => !path.has(keyOf(resolved.other)))
    .filter((resolved) => isWorthShowingUnder(ref.type, resolved.other.type))
    .filter((resolved) => isLive(ref.type, resolved.other, context))
    .sort(
      (a, b) =>
        viewOrder(ref.type, a.other.type) - viewOrder(ref.type, b.other.type)
    )
    .map((resolved) => resolved.other.type);

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
  const isRoot = ancestors.size === 0;
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
    .filter((resolved) => matchesView(ref.type, resolved.other.type, priority))
    // the root shows everything it is allowed to; below it, only what is
    // worth the space
    .filter(
      (resolved) => isRoot || isWorthShowingUnder(ref.type, resolved.other.type)
    )
    .filter((resolved) => isLive(ref.type, resolved.other, context))
    .sort(
      (a, b) =>
        viewOrder(ref.type, a.other.type) - viewOrder(ref.type, b.other.type)
    );

  const summary = edges.map((resolved) => resolved.other.type);

  if (remaining <= 0) {
    return {
      entity: ref,
      edge,
      children: [],
      summary,
      truncated: edges.length > 0,
      depth: ancestors.size,
    };
  }

  const children: RelationshipNode[] = edges.map((resolved) => {
    // stopping at an edge that does not expand is the design, not a
    // truncation, so it gets no "there is more" affordance. The hint row
    // still needs to know what is behind it, which is one lookup not a walk.
    if (!expands(resolved.type) || !nests(resolved.other.type)) {
      const childPath = new Set(path);
      childPath.add(keyOf(resolved.other));

      return {
        entity: resolved.other,
        edge: resolved,
        children: [],
        summary: neighbourTypesOf(resolved.other, childPath, context),
        truncated: false,
        depth: path.size,
      };
    }

    // priority narrows the root's neighbours only
    return walk(resolved.other, resolved, remaining - 1, path, context);
  });

  return {
    entity: ref,
    edge,
    children,
    summary,
    truncated: false,
    depth: ancestors.size,
  };
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
  { depth = DEFAULT_DEPTH, priority, on }: RelationshipTreeOptions = {}
): RelationshipNode => {
  const { data: relationships, isLoading } = useRelationshipsState();
  const { data: tasks } = useTasksState();
  const { data: projects } = useProjectsState();
  const { data: habits } = useHabitsNewState();

  // callers pass a fresh { id, type } literal every render, so the memo has
  // to key on the two values rather than the object. `on` is a Date and has
  // the same problem, so it keys on the instant rather than the object.
  const { id: rootId, type: rootType } = root;
  const onTime = on?.getTime();

  return useMemo(() => {
    const entity: EntityRef = { id: rootId, type: rootType };
    const empty: RelationshipNode = {
      entity,
      edge: null,
      children: [],
      summary: [],
      truncated: false,
      depth: 0,
    };

    if (isLoading || !relationships) {
      return empty;
    }

    const context: WalkContext = {
      index: buildIndex(relationships),
      taskStatusById: taskStatusById(tasks ?? []),
      habitCompletedOnDay: habitCompletionOn(
        habits ?? [],
        onTime === undefined ? undefined : new Date(onTime)
      ),
      liveProjects: liveProjectIds(projects ?? []),
    };

    return walk(entity, null, depth, new Set(), context, priority);
  }, [
    relationships,
    isLoading,
    tasks,
    habits,
    projects,
    rootId,
    rootType,
    onTime,
    depth,
    priority,
  ]);
};
