import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelatedEntity } from "../RelatedEntity/RelatedEntity";

export interface RelationshipPanelProps {
  entityId: number;
  entityType: RelationshipEntityType;
  compact: boolean;
}
export const EntityWithRelationships: FC<RelationshipPanelProps> = ({
  entityId,
  entityType,
  compact,
}) => {
  const relationships = useRelevantRelationshipsForEntity({
    entityId,
    entityType,
  });

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {relationships.map((r) => (
        <RelatedEntity key={r.id} relationship={r} compact={compact} />
      ))}
      {!relationships.length && <div className="w-full">no stuff here</div>}
    </div>
  );
};
