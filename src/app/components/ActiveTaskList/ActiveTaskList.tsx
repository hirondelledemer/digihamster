"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";
import TaskCard from "../TaskCard";
import useTasks from "@/app/utils/hooks/use-tasks";

export const taskTestId = "ActiveTaskList-task-testid";

export interface ActiveTaskListProps {
  testId?: string;
}

const ActiveTaskList: FC<ActiveTaskListProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();

  return (
    <div data-testid={testId}>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          testId={taskTestId}
          task={task}
          className="mb-4"
        />
      ))}
    </div>
  );
};

export default ActiveTaskList;
