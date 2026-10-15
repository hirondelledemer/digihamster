"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC, useMemo } from "react";

import { ScrollArea } from "../ui/scroll-area";
import { useTasksState } from "@/app/utils/hooks/use-tasks/state-context";
import { DraggableTaskCard } from "../TaskCard/DraggableTaskCard";
import { TaskStatus } from "@/app/utils/types/task";

export const ActiveTaskList: FC = (): JSX.Element | null => {
  const { data: tasks } = useTasksState();

  const tasksToShow = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.status === TaskStatus.Doing && !task.deadline && !task.event_id
      ),
    [tasks]
  );

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasksToShow.map((task) => (
            <DraggableTaskCard dragId={task.id} key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
