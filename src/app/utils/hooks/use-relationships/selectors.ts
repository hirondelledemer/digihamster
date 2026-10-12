import {
  IRelationship,
  RelationshipEntityType,
} from "../../types/relationship";
import { useRelationshipsState } from "./state-context";

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

const ALLOWED_TYPES: {
  [key: string]: RelationshipEntityType[]; // TODO: fix. also maybe extract
} = {
  [RelationshipEntityType.Location]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Event]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Person,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Location,
    RelationshipEntityType.Project,
  ],
  [RelationshipEntityType.Person]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Journal,
    RelationshipEntityType.Note,
    RelationshipEntityType.Habit,
    RelationshipEntityType.Event,
  ],
  [RelationshipEntityType.Project]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
  ],
  [RelationshipEntityType.Task]: [
    RelationshipEntityType.Task,
    RelationshipEntityType.Note,
    RelationshipEntityType.Person,
    RelationshipEntityType.Location,
  ],
  [RelationshipEntityType.Journal]: [
    RelationshipEntityType.Person,
    RelationshipEntityType.Event,
  ],
};

export const useRelevantRelationshipsForEntity = ({
  entityId,
  entityType,
}: {
  entityId: number;
  entityType: RelationshipEntityType;
}): IRelationship[] => {
  const relationships = useAllRelationshipsForEntity({ entityId, entityType });

  return relationships.filter((r) =>
    (ALLOWED_TYPES[entityType] || []).includes(r.target_type)
  );
};
