import { EventActions } from "@/app/components/EventActions";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useEventById } from "@/app/utils/hooks/use-events/selectors";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendar } from "@tabler/icons-react";
import { FC } from "react";
import { EntityTypeIcon } from "../../../EntityTypeIcon";

export const RelatedEvent: FC<{
  id: number;
  compact: boolean;
}> = ({ id, compact }) => {
  const event = useEventById(id);

  const relationships = useRelevantRelationshipsForEntity({
    entityId: id,
    entityType: RelationshipEntityType.Event,
  });

  if (!event) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1">
        <IconCalendar size={24} aria-label="location" />
        {relationships.map((r) => (
          <EntityTypeIcon key={r.id} type={r.target_type} size={16} />
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
