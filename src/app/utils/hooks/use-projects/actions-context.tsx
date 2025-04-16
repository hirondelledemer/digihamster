import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Project } from "@/models/project";

interface ProjectActionsContextValue {
  createProject(
    project: Pick<Project, FieldsRequired>,
    onDone?: () => void
  ): void;
  updateProject(
    projectId: string,
    project: Partial<Project>,
    onDone?: () => void
  ): void;
  deleteProject(projectId: string, onDone?: () => void): void;
  updateOrder(
    movedProjectId: string,
    overProjectId: string,
    onDone?: () => void
  ): void;
}

const DEFAULT_PROJECTS_ACTIONS: ProjectActionsContextValue = {
  createProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  updateOrder: () => {},
} as const;

export const ProjectsActionsContext = createContext<ProjectActionsContextValue>(
  DEFAULT_PROJECTS_ACTIONS
);

export const useProjectsActions = () => useContext(ProjectsActionsContext);
