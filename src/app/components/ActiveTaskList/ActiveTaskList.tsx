"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC, useMemo } from "react";

import useTasks from "@/app/utils/hooks/use-tasks";

import { ScrollArea } from "../ui/scroll-area";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";
import TaskCard from "../TaskCard";

export const taskTestId = "ActiveTaskList-task-testid";

export interface ActiveTaskListProps {
  testId?: string;
}

const ActiveTaskList: FC<ActiveTaskListProps> = ({
  testId,
}): JSX.Element | null => {
  const { data: tasks } = useTasks();

  const tasksToShow = useMemo(
    () =>
      tasks
        .filter(
          (task) => task.status === "doing" && !task.deadline && !task.event_id,
        )
        .sort((a, b) =>
          a.status === b.status ? 0 : a.status === "done" ? 1 : -1,
        ),
    [tasks],
  );

  const pendingTasksCount = useMemo(
    () => tasksToShow.filter((t) => !(t.status === "done")).length,
    [tasksToShow],
  );

  const completedTasksCount = useMemo(
    () => tasksToShow.filter((t) => t.status === "done").length,
    [tasksToShow],
  );

  return (
    <div data-testid={testId} className="w-full h-full">
      <div className="text-sm flex items-center mb-3 space-x-2">
        <IconCircle size={16} color="green" className="mr-1" />
        {pendingTasksCount}
        <IconCircleCheck
          size={19}
          color="black"
          fill="green"
          className="mr-1"
        />
        {completedTasksCount}
      </div>
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          {tasksToShow.map((task) => (
            <TaskCard
              dragId={task.id}
              key={task.id}
              task={task}
              testId={taskTestId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveTaskList;
