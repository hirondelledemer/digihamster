import { useNavigator } from "@/app/components/EventRelationships/navigator-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useLocationById } from "@/app/utils/hooks/use-location/selectors";
import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconMapPin } from "@tabler/icons-react";
import { FC } from "react";
import { RelatedEntity } from "../RelatedEntity";
import { EntityTypeIcon } from "../../../EntityTypeIcon";

export const RelatedLocation: FC<{
  id: number;
  compact: boolean;
  /** whatever the walk put under this location; empty when it stopped here */
  related?: RelationshipNode[];
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, compact, related = [], summary = [] }) => {
  const location = useLocationById(id);
  const { setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Location,
    });

  if (!location) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1 w-[20px]">
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <IconMapPin
              size={24}
              color={location.color}
              aria-label="location"
              className="cursor"
              onClick={selectEntity}
            />
          </TooltipTrigger>
          <TooltipContent className="w-[200px]" side="right">
            {location.title}
          </TooltipContent>
        </Tooltip>
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="flex gap-2">
            <IconMapPin
              size={16}
              color={location.color}
              aria-label="location"
            />
            <div style={{ color: location.color }}>{location.title}</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {related.map((child) => (
            <RelatedEntity
              key={child.edge?.id ?? child.entity.id}
              node={child}
              compact={false}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
