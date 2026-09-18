import { RelationshipEntityType } from "../../types/relationship";
import { useRelationshipsState } from "./state-context";

export const useRelatioshipBetweenEntities = ({
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
