"use client";

import { sortInTheEvent } from "../../tasks/sort";
import { ITask, TaskStatus } from "../../types/task";
import { useTasksState } from "./state-context";

export const useActiveTasks = (): ITask[] => {
  const { data } = useTasksState();

  return data.filter(
    (task) =>
      task.status === TaskStatus.Doing || task.status === TaskStatus.Todo
  );
};

export const useTasksForEvent = (eventId: number): ITask[] => {
  const { data } = useTasksState();

  return sortInTheEvent(data).filter((task) => task.event_id === eventId);
};

export const useFirstTaskForTheProject = (projectId: number): ITask => {
  const { data } = useTasksState(); // TODO: rename
  const sortedTasks = data
    .filter(
      (t) =>
        t.project_id === projectId &&
        (t.status === TaskStatus.Doing || t.status === TaskStatus.Todo)
    )
    .sort(
      (taskA, taskB) =>
        (taskA.project_sort_order || 0) - (taskB.project_sort_order || 0)
    );

  return sortedTasks[0];
};

export const useFirstTaskForTheProjects = (projectIds: number[]): ITask[] => {
  const { data } = useTasksState(); // TODO: rename

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

export const useTaskById = (id: number | null | undefined): ITask | null => {
  const { data } = useTasksState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((task) => task.id === id) ?? null;
};
