"use client";
import { IProject } from "../../types/project";
import { RelationshipEntityType } from "../../types/relationship";
import { ITask } from "../../types/task";
import { useRelationshipsState } from "../use-relationships/state-context";
import { useProjectsState } from "./state-context";

export const useProjectById = (
  id: number | null | undefined
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
  task: ITask | null
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

export const useProjectsForTheEventByLocation = (
  eventId: number
): IProject[] => {
  const { data: projects, isLoading: isProjectsLoading } = useProjectsState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (
    isProjectsLoading ||
    isRelationshipsLoading ||
    !projects ||
    !relationships
  ) {
    return [];
  }

  const eventLocationIds = relationships
    .filter(
      (r) =>
        r.source_id === eventId &&
        r.target_type === RelationshipEntityType.Location
    )
    .map((r) => r.target_id);

  const projectIds = relationships
    .filter(
      (r) =>
        r.source_type === RelationshipEntityType.Project &&
        r.target_type === RelationshipEntityType.Location &&
        eventLocationIds.includes(r.target_id)
    )
    .map((r) => r.source_id);

  const filteredProjects = projects.filter((p) => projectIds.includes(p.id));

  return filteredProjects;
};
