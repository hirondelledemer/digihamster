"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { IEvent } from "@/app/utils/types/event";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";
import { now } from "@/app/utils/date/now";
import { RelationshipNavigator } from "@/app/components/EventRelationships/EventRealtionships";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

interface ActiveEventInfoProps {
  event: IEvent;
}

export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
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
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          <RelationshipNavigator
            entityId={event.id}
            entityType={RelationshipEntityType.Event}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
