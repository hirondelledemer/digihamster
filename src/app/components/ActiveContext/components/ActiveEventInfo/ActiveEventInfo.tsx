"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";

import { useTasksForEvent } from "@/app/utils/hooks/use-tasks-new/selectors";
import { IEvent } from "@/app/utils/types/event";

import TaskCard from "@/app/components/TaskCard";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface ActiveEventInfoProps {
  event: IEvent;
}
export const ActiveEventInfo: FC<ActiveEventInfoProps> = ({
  event,
}): JSX.Element | null => {
  const tasks = useTasksForEvent(event.id);

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
