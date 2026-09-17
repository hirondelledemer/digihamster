"use client";

import React, { FC } from "react";

import {
  useCurrentEvent,
  useEventById,
} from "@/app/utils/hooks/use-events/selectors";
import ActiveTaskList from "../ActiveTaskList";
import { useRouter, useSearchParams } from "next/navigation";

export const ActiveContext: FC = (): JSX.Element | null => {
  const currentEvent = useCurrentEvent();
  const searchParams = useSearchParams();
  //   const router = useRouter();

  const selectedEventId = searchParams.get("eventId"); // TODO: convert to number

  const selectedEvent = useEventById(
    selectedEventId ? Number(selectedEventId) : null
  );
  const eventToShow = selectedEvent || currentEvent;

  if (!eventToShow) {
    return <ActiveTaskList />;
  }

  return (
    <div className="w-full h-full">
      active event: {eventToShow.title}
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
