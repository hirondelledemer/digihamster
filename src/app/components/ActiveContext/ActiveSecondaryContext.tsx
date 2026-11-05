"use client";

import React, { FC } from "react";

import { useSelectedEvent } from "./use-selected-event";
import { Agent } from "../Agent";
import ProjectProgress from "../ProjectProgress";
import HealthChart from "../HealthChart";
import { RelationshipNavigator } from "../EventRelationships/components/RelationshipNavigator";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { parseBackendDateTime } from "#utils/date";
import { ActiveTaskList } from "../ActiveTaskList";

export const ActiveSecondaryContext: FC = (): JSX.Element | null => {
  const selectedEvent = useSelectedEvent();

  if (!selectedEvent) {
    return (
      <>
        <Agent />
        <ProjectProgress />
        <HealthChart />
      </>
    );
  }

  return (
    <div className="w-full h-full ">
      <ScrollArea className="h-[50%] pb-5">
        <ActiveTaskList />
      </ScrollArea>
      <ScrollArea className="h-[50%]">
        <RelationshipNavigator
          entityId={selectedEvent.id}
          entityType={RelationshipEntityType.Event}
          relationshipPriority="secondary"
          day={parseBackendDateTime(selectedEvent.start_at)}
        />
      </ScrollArea>
    </div>
  );
};
