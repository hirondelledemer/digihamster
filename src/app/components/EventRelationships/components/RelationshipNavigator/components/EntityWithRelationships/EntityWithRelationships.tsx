import { useRelationshipTree } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { FC, useContext } from "react";
import { RelationshipNavigatorContext } from "@/app/components/EventRelationships/navigator-context";
import {
  RelatedEntity,
  RelatedEntityVariant,
} from "../RelatedEntity/RelatedEntity";

export interface RelationshipPanelProps {
  entityId: number;
  entityType: RelationshipEntityType;
  variant: RelatedEntityVariant;
  relationshipPriority?: "primary" | "secondary";
}
export const EntityWithRelationships: FC<RelationshipPanelProps> = ({
  entityId,
  entityType,
  variant,
  relationshipPriority,
}) => {
  const { day } = useContext(RelationshipNavigatorContext);

  const tree = useRelationshipTree(
    { id: entityId, type: entityType },
    {
      // a compact column draws one icon per neighbour and nothing below it,
      // so there is no point walking further than the first level
      depth: variant === "compact" ? 1 : 2,
      priority: relationshipPriority,
      on: day,
    }
  );

  return (
    <div className="flex flex-col gap-2 items-center w-full">
      {tree.children.map((child) => (
        <RelatedEntity
          key={child.edge?.id ?? `${child.entity.type}-${child.entity.id}`}
          node={child}
          variant={variant}
        />
      ))}
      {!tree.children.length && <div className="w-full">no stuff here</div>}
    </div>
  );
};
