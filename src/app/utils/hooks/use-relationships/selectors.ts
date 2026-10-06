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

export type EntityRelationship = {
  id: number;
  entity_id: number;
  target_id: number;
  target_type: RelationshipEntityType;
};

export const useAllRelationshipsForEntity = ({
  entityId,
  entityType,
}: {
  entityId: number;
  entityType: RelationshipEntityType;
}): EntityRelationship[] => {
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (isRelationshipsLoading || !relationships) {
    return [];
  }

  const targets = relationships
    .filter((r) => r.source_id === entityId && r.source_type === entityType)
    .map((r) => ({
      id: r.id,
      entity_id: r.source_id,
      target_id: r.target_id,
      target_type: r.target_type,
    }));

  const sources = relationships
    .filter((r) => r.target_id === entityId && r.target_type === entityType)
    .map((r) => ({
      id: r.id,
      entity_id: r.target_id,
      target_id: r.source_id,
      target_type: r.source_type,
    }));

  return [...targets, ...sources];
};
