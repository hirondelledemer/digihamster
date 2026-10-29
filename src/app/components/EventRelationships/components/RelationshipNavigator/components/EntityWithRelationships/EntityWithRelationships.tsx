import { useRelationshipTree } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelatedEntity } from "../RelatedEntity/RelatedEntity";

export interface RelationshipPanelProps {
  entityId: number;
  entityType: RelationshipEntityType;
  compact: boolean;
  relationshipPriority?: "primary" | "secondary";
}
export const EntityWithRelationships: FC<RelationshipPanelProps> = ({
  entityId,
  entityType,
  compact,
  relationshipPriority,
}) => {
  const tree = useRelationshipTree(
    { id: entityId, type: entityType },
    {
      // a compact column draws one icon per neighbour and nothing below it,
      // so there is no point walking further than the first level
      depth: compact ? 1 : 2,
      priority: relationshipPriority,
    }
  );

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {tree.children.map((child) => (
        <RelatedEntity
          key={child.edge?.id ?? `${child.entity.type}-${child.entity.id}`}
          node={child}
          compact={compact}
        />
      ))}
      {!tree.children.length && <div className="w-full">no stuff here</div>}
    </div>
  );
};
