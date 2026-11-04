"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { IEvent } from "@/app/utils/types/event";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";
import { now } from "@/app/utils/date/now";
import { parseBackendDateTime } from "#utils/date";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipNavigator } from "@/app/components/EventRelationships/components/RelationshipNavigator";
import { Button } from "@/app/components/ui/button";
import { useCompleteEvent } from "@/app/utils/event/event-completion";

interface ActiveEventInfoProps {
  event: IEvent;
}

export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  const handleEventCompletion = useCompleteEvent(event);
  const isEventToday = isSameDay(event.start_at, now());

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
