"use client";

import React, { FC, useEffect } from "react";

import {
  useCurrentEvent,
  useEventById,
} from "@/app/utils/hooks/use-events/selectors";
import { useRouter, useSearchParams } from "next/navigation";
import { Agent } from "../Agent";
import ProjectProgress from "../ProjectProgress";
import HealthChart from "../HealthChart";
import { RelationshipNavigator } from "../EventRelationships/components/RelationshipNavigator";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { ScrollArea } from "@/app/components/ui/scroll-area";

export const ActiveSecondaryContext: FC = (): JSX.Element | null => {
  const currentEvent = useCurrentEvent();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedEventId = searchParams.get("eventId"); // TODO: convert to number

  useEffect(() => {
    if (!selectedEventId && currentEvent) {
      router.replace(`/?eventId=${currentEvent.id}`, undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentEvent]);

  const selectedEvent = useEventById(
    selectedEventId ? Number(selectedEventId) : null
  );

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
    <div className="w-full h-full">
      <ScrollArea className="h-full pb-[60px]">
        <RelationshipNavigator
          entityId={selectedEvent.id}
          entityType={RelationshipEntityType.Event}
          relationshipPriority="secondary"
        />
      </ScrollArea>
    </div>
  );
};
