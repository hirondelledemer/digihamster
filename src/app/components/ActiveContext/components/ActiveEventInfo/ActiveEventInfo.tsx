"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { EventStatus, IEvent } from "@/app/utils/types/event";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";
import { now } from "@/app/utils/date/now";
import { parseBackendDateTime } from "#utils/date";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipNavigator } from "@/app/components/EventRelationships/components/RelationshipNavigator";
import { Button } from "@/app/components/ui/button";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { useTasksActions } from "@/app/utils/hooks/use-tasks/actions-context";
import { useRelevantRelationshipsForEntity } from "@/app/utils/hooks/use-relationships/selectors";
import { TaskStatus } from "@/app/utils/types/task";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { useNotesActions } from "@/app/utils/hooks/use-notes/actions-context";

interface ActiveEventInfoProps {
  event: IEvent;
}

export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  const { update: updateEvent } = useEventsActions();
  const { updateTask } = useTasksActions();
  const { create: createRelationship } = useRelationshipsActions();
  const { create: createNote } = useNotesActions();

  const relationships = useRelevantRelationshipsForEntity({
    entityId: event.id,
    entityType: RelationshipEntityType.Event,
  });

  const relatedTasksEdges = relationships.filter(
    (r) => r.target_type === RelationshipEntityType.Task
  );

  const isEventToday = isSameDay(event.start_at, now());

  const handleEventCompletion = async () => {
    await updateEvent(event.id, { status: EventStatus.Completed });
    relatedTasksEdges.forEach(async (r) => {
      updateTask(r.target_id, { status: TaskStatus.Doing });

      const note = await createNote({
        title: "",
        content: ``,
        json_content: {
          content: [
            {
              content: [
                {
                  text: `activated after "${event.title}" (on ${format(
                    event.start_at,
                    "MMM d"
                  )}) was completed`,
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
      });

      if (!!note) {
        createRelationship({
          source_id: r.target_id,
          source_type: r.target_type,
          target_id: note.id,
          target_type: RelationshipEntityType.Note,
        });
      }
    });
  };

  return (
    <div className="w-full h-full">
      <div className="py-4 flex">
        {!isEventToday && (
          <div className="mr-5">{format(event.start_at, "MMM d")}</div>
        )}
        <div>
          {format(event.start_at, "HH:mm")} - {format(event.end_at, "HH:mm")}
        </div>
      </div>
      <Button onClick={handleEventCompletion}>Complete</Button>
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          <RelationshipNavigator
            entityId={event.id}
            entityType={RelationshipEntityType.Event}
            relationshipPriority="primary"
            day={parseBackendDateTime(event.start_at)}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
