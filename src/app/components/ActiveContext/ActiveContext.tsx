"use client";

import React, { FC, useEffect } from "react";

import {
  useCurrentEvent,
  useEventById,
} from "@/app/utils/hooks/use-events/selectors";
import ActiveTaskList from "../ActiveTaskList";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export const ActiveContext: FC = (): JSX.Element | null => {
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
    return <ActiveTaskList />;
  }

  const handleBackClick = () => {
    if (selectedEventId) {
      router.replace("/", undefined);
    }
  };

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
        <div className="text-xl">{selectedEvent.title}</div>
      </div>
      {/* <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasksToShow.map((task) => (
            <DraggableTaskCard dragId={task.id} key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea> */}
    </div>
  );
};
