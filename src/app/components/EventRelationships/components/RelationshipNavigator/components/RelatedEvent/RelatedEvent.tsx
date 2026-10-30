import { EventActions } from "@/app/components/EventActions";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendar } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";
import { useCalendarDate } from "@/app/utils/hooks/use-calendar-date";
import { formatDistanceToNow, format, compareAsc } from "date-fns";
import { now } from "@/app/utils/date/now";
import { Button } from "@/app/components/ui/button";

export const RelatedEvent: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
  depth: number;
}> = ({ id, compact, summary = [], depth }) => {
  const event = useEventById(id);
  const { setSelectedDate } = useCalendarDate();

  if (!event) {
    return null;
  }

  if (compact) {
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
