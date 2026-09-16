"use client";

import { ITask, TaskStatus } from "../../types/task";
import { useTasksNewState } from "./state-context";

export const useActiveTasks = (): ITask[] => {
  const { data } = useTasksNewState();

  return data.filter(
    (task) =>
      task.status === TaskStatus.Doing || task.status === TaskStatus.Todo
  );
};
