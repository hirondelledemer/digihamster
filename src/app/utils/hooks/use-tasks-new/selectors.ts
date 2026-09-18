"use client";

import { sortInTheEvent } from "../../tasks/sort";
import { ITask, TaskStatus } from "../../types/task";
import { useTasksNewState } from "./state-context";

export const useActiveTasks = (): ITask[] => {
  const { data } = useTasksNewState();

  return data.filter(
    (task) =>
      task.status === TaskStatus.Doing || task.status === TaskStatus.Todo
  );
};

export const useTasksForEvent = (eventId: number): ITask[] => {
  const { data } = useTasksNewState();

  return sortInTheEvent(data).filter((task) => task.event_id === eventId);
};
