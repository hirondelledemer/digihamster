import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import {
  ALLOWED_TYPES,
  isAllowedTarget,
  isTerminalProjectStatus,
  isTerminalTaskStatus,
} from "../../relationships/display-rules";
import { useTasksState } from "../use-tasks/state-context";
import { useRelationshipsState } from "./state-context";
import { useProjectsState } from "../use-projects/state-context";

export const useRelationshipIdBetweenEntities = ({
  targetId,
  targetType,
  sourceId,
  sourceType,
}: {
  targetId: number;
  targetType: RelationshipEntityType;
  sourceId: number;
  sourceType: RelationshipEntityType;
}): number | null => {
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isRelationshipsLoading || !relationships) {
    return null;
  }

  return (
    relationships.find(
      (r) =>
        r.target_id === targetId &&
        r.target_type === targetType &&
        r.source_id === sourceId &&
        r.source_type === sourceType
    )?.id || null
  );
};

export const useTargetRelationshipsForEntity = ({
  sourceId,
  sourceType,
}: {
  sourceId: number;
  sourceType: RelationshipEntityType;
}): IRelationship[] => {
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isRelationshipsLoading || !relationships) {
    return [];
  }

  return relationships.filter(
    (r) => r.source_id === sourceId && r.source_type === sourceType
  );
};

/** gets all source and target relationships for the provided entity */
export const useAllRelationshipsForEntity = ({
  entityId,
  entityType,
}: {
  entityId: number;
  entityType: RelationshipEntityType;
}): IRelationship[] => {
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isRelationshipsLoading || !relationships) {
    return [];
  }

  const targets = relationships
    .filter((r) => r.source_id === entityId && r.source_type === entityType)
    .map((r) => ({
      id: r.id,
      source_id: r.source_id,
      source_type: r.source_type,
      target_id: r.target_id,
      target_type: r.target_type,
      relationship_type: "related",
    }));

  const sources = relationships
    .filter((r) => r.target_id === entityId && r.target_type === entityType)
    .map((r) => ({
      id: r.id,
      source_id: r.target_id,
      source_type: r.target_type,
      target_id: r.source_id,
      target_type: r.source_type,
      relationship_type: "related",
    }));

  return [...targets, ...sources];
};

/** the neighbours worth showing in the panel of the given entity */
export const useRelevantRelationshipsForEntity = ({
  entityId,
  entityType,
}: {
  entityId: number;
  entityType: RelationshipEntityType;
}): IRelationship[] => {
  const relationships = useAllRelationshipsForEntity({ entityId, entityType });
  const { data: tasks } = useTasksState();
  const { data: projects } = useProjectsState();

  return relationships
    .filter((r) => {
      if (!isAllowedTarget(entityType, r)) {
        return false;
      }

      // A done or cancelled task is history. Dropping it here rather than in
      // RelatedTask means the surrounding chrome - the action buttons, the
      // "no stuff here" empty state - agrees about what is on screen.
      if (r.target_type === RelationshipEntityType.Task) {
        const task = tasks.find((t) => t.id === r.target_id);
        return !!task && !isTerminalTaskStatus(task.status);
      }

      if (r.target_type === RelationshipEntityType.Project) {
        const project = projects.find((p) => p.id === r.target_id);
        return !!project && !isTerminalProjectStatus(project.status);
      }

      return true;
    })
    .sort((a, b) => {
      return (
        ALLOWED_TYPES[entityType].indexOf(a.target_type) -
        ALLOWED_TYPES[entityType].indexOf(b.target_type)
      );
    });
};

export interface EntityRef {
  id: number;
  type: RelationshipEntityType;
}

/**
 * The edge joining two entities, whichever way round it happens to be stored.
 *
 * `useRelationshipIdBetweenEntities` matches the stored direction only, which
 * is fine when you know which end wrote the row. A task can be attached to an
 * event from either side, so asking "are these two joined at all" has to look
 * both ways. Either ref may be null, so callers can ask the question before
 * they know there is anything to ask about.
 */
export const useRelationshipBetweenEntities = (
  a: EntityRef | null,
  b: EntityRef | null
): IRelationship | null => {
  const { data: relationships, isLoading } = useRelationshipsState();

  if (isLoading || !relationships || !a || !b) {
    return null;
  }

  const joins = (r: IRelationship, from: EntityRef, to: EntityRef) =>
    r.source_id === from.id &&
    r.source_type === from.type &&
    r.target_id === to.id &&
    r.target_type === to.type;

  return relationships.find((r) => joins(r, a, b) || joins(r, b, a)) ?? null;
};
