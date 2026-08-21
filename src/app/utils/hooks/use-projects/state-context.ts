import { createContext, useContext } from "react";
import { ProjectsState } from "./actions";
import { IProject } from "../../types/project";

type ProjectContextValue = ProjectsState & {
  getProjectById: (id: number) => IProject | null;
};

const DEFAULT_PROJECTS_STATE: ProjectsState = {
  data: [],
  defaultProject: null,
  isLoading: true,
  errorMessage: undefined,
} as const;

export const ProjectsStateContext = createContext<ProjectContextValue>({
  ...DEFAULT_PROJECTS_STATE,
  getProjectById: (_id: number) => null,
});

export const useProjectsState = () => useContext(ProjectsStateContext);
