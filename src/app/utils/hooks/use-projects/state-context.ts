import { createContext, useContext } from "react";
import { ProjectsState } from "./actions";

const DEFAULT_PROJECTS_STATE: ProjectsState = {
  data: [],
  defaultProject: null,
  isLoading: true,
  errorMessage: undefined,
} as const;

export const ProjectsStateContext =
  createContext<ProjectsState>(DEFAULT_PROJECTS_STATE);

export const useProjectsState = () => useContext(ProjectsStateContext);
