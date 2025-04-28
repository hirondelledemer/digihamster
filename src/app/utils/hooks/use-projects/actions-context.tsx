import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Project } from "@/models/project";
import { ActionsContextValue } from "../use-crud/actions-context";

type ProjectActionsContextValue = ActionsContextValue<
  FieldsRequired,
  Project
> & {
  updateOrder(
    movedProjectId: string,
    overProjectId: string,
    onDone?: () => void
  ): void;
};

const DEFAULT_PROJECTS_ACTIONS: ProjectActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
  updateOrder: () => {},
} as const;

export const ProjectsActionsContext = createContext<ProjectActionsContextValue>(
  DEFAULT_PROJECTS_ACTIONS
);

export const useProjectsActions = () => useContext(ProjectsActionsContext);
