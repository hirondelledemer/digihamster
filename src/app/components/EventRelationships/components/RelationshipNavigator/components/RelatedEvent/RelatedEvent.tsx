import { EventActions } from "@/app/components/EventActions";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendar } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";

export const RelatedEvent: FC<{
  id: number;
  compact: boolean;
  /** neighbour types behind this one, for the hint row of little icons */
  summary?: RelationshipEntityType[];
}> = ({ id, compact, summary = [] }) => {
  const event = useEventById(id);


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
