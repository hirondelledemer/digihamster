import { EventActions } from "@/app/components/EventActions";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendar } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { useCalendarDate } from "@/app/utils/hooks/use-calendar-date";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { RelatedEntityVariant } from "../RelatedEntity/RelatedEntity";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useNavigator } from "@/app/components/EventRelationships/navigator-context";

export const RelatedEvent: FC<{
  id: number;
  variant: RelatedEntityVariant;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
  depth: number;
}> = ({ id, variant, summary = [], depth }) => {
  const event = useEventById(id);
  const { setSelectedDate } = useCalendarDate();

  const { setActiveEntity } = useNavigator();

  const selectEntity = () =>
    setActiveEntity({
      id,
      type: RelationshipEntityType.Event,
    });

  if (!event) {
    return null;
  }

  if (variant === "icon") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          className="pointer-events-auto"
          onMouseDownCapture={(e) => {
            // the calendar starts a slot selection on a native mousedown
            e.stopPropagation();
          }}
        >
          <IconCalendar
            size={16}
            // color={person.color}
            aria-label={event.title}
            className="cursor"
            onClick={selectEntity}
          />
        </TooltipTrigger>
        <TooltipContent>{event.title}</TooltipContent>
      </Tooltip>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center gap-1">
        <IconCalendar size={24} aria-label="event" />
        {summary.map((type, i) => (
          <EntityTypeIcon key={`${type}-${i}`} type={type} size={16} />
        ))}
      </div>
    );
  }

  if (depth !== 1) {
    return (
      <Button
        variant="link"
        onClick={() => setSelectedDate(new Date(event.start_at))}
        className="gap-2"
      >
        <IconCalendar size={16} />
        {/* TODO: maybe memoise this value? */}
        Also mentioned on {event.title} ({format(event.start_at, "cccccc")},{" "}
        {formatDistanceToNow(event.start_at, { addSuffix: true })})
      </Button>
    );
  }

  return (
    <EventActions event={event}>
      <Card className="p-0 rounded-md">
        <CardHeader className="p-4 pt-2">
          <CardTitle className="font-normal flex items-center justify-between">
            <div>{event.title}</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </EventActions>
  );
};
