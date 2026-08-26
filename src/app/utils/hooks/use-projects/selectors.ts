"use client";
import { IProject } from "../../types/project";
import { ITask } from "../../types/task";
import { useProjectsState } from "./state-context";

export const useProjectById = (
  id: number | null | undefined,
): IProject | null => {
  const { data } = useProjectsState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((project) => project.id === id) ?? null;
};

export const useTaskProject = (task: ITask | null): IProject | null =>
  useProjectById(task?.project_id);

export const useTaskProjectColor = (
  task: ITask | null,
): { main: string; dimmed: string } | undefined => {
  const color = useTaskProject(task)?.color;

  if (!color) {
    return;
  }

  return {
    main: color,
    dimmed: `color-mix(in srgb, ${color} 10%, transparent)`,
  };
};
