"use client";

import React, { FC } from "react";

import { useSelectedEvent } from "./use-selected-event";
import { ActiveTaskList } from "../ActiveTaskList";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { ActiveEventInfo } from "./components/ActiveEventInfo";

export const eventTitleTestId = "ActiveContext-event-title-testid";

export const ActiveContext: FC = (): JSX.Element | null => {
  const selectedEvent = useSelectedEvent();
  const router = useRouter();

  const handleBackClick = () => router.replace("/", undefined);

  if (!selectedEvent) {
    return <ActiveTaskList />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="back"
          onClick={handleBackClick}
        >
          <IconArrowLeft />
        </Button>
        <div className="text-xl" data-testid={eventTitleTestId}>
          {selectedEvent.title}
        </div>
      </div>
      <ActiveEventInfo event={selectedEvent} />
    </div>
  );
};
