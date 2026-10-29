import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import { Button } from "@/app/components/ui/button";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconArrowRampRight2 } from "@tabler/icons-react";
import { Trash } from "lucide-react";
import { FC, ReactNode } from "react";

export const RelatedEntityActions: FC<{
  entityId: number;
  entityType: RelationshipEntityType;
  children: ReactNode;
  relationshipId: number;
  /**
   * Whether drilling in would show anything: either neighbours the walk
   * stopped short of, or ones it showed only as hint icons.
   *
   * This used to be its own lookup, which lit the arrow on every entity -
   * the row joining it to the thing you are looking at counts as a
   * relationship, so nothing ever came back empty.
   */
  hasMore?: boolean;
}> = ({ entityId, entityType, children, relationshipId, hasMore = false }) => {

  const { setActiveEntity } = useNavigator();

  const { delete: remove } = useRelationshipsActions();

  const selectEntity = () =>
    setActiveEntity({
      id: entityId,
      type: entityType,
    });

  return (
    <div className="relative w-full">
      <div className="absolute right-0 z-10 flex flex-col">
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <IconArrowRampRight2
            onClick={selectEntity}
            size={12}
            color={hasMore ? "#e11d48" : "grey"}
          />
        </Button>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Trash
            size={12}
            color="grey"
            onClick={() => {
              remove(relationshipId);
            }}
          />
        </Button>
      </div>
      <div className="w-[93%]">{children}</div>
    </div>
  );
};
