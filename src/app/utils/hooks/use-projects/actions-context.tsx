import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { IProject } from "../../types/project";

type ProjectActionsContextValue = ActionsContextValue<
  FieldsRequired,
  IProject
> & {
  updateOrder(
    movedProjectId: number,
    overProjectId: number,
    onDone?: () => void,
  ): void;
};

const DEFAULT_PROJECTS_ACTIONS: ProjectActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
  updateOrder: () => {},
} as const;

export const ProjectsActionsContext = createContext<ProjectActionsContextValue>(
  DEFAULT_PROJECTS_ACTIONS,
);

export const useProjectsActions = () => useContext(ProjectsActionsContext);
