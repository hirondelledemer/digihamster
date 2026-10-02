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

export const useFirstTaskForTheProject = (projectId: number): ITask => {
  const { data } = useTasksNewState(); // TODO: rename
  const sortedTasks = data
    .filter((t) => t.project_id === projectId)
    .sort(
      (taskA, taskB) =>
        (taskA.project_sort_order || 0) - (taskB.project_sort_order || 0)
    );

  return sortedTasks[0];
};

export const useFirstTaskForTheProjects = (projectIds: number[]): ITask[] => {
  const { data } = useTasksNewState(); // TODO: rename

  return projectIds.map((projectId) => {
    return data
      .filter(
        (t) =>
          t.project_id === projectId &&
          (t.status === TaskStatus.Doing || t.status === TaskStatus.Todo)
      )
      .sort(
        (taskA, taskB) =>
          (taskA.project_sort_order || 0) - (taskB.project_sort_order || 0) // TODO: export and also this exists in taskinfo
      )[0];
  });
};
