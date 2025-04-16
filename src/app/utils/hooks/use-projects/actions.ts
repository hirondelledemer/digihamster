import { Project } from "@/models/project";

export interface ProjectsState {
  data: Project[];
  defaultProject: Project | null;
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum ProjectsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateProject = "CREATE_PROJECT",
  UpdateProject = "UPDATE_PROJECT",
  DeleteProject = "DELETE_PROJECT",
  UpdateOrder = "UPDATE_ORDER",
}

export interface ProjectsLoadAction {
  type: ProjectsStateActionType.StartLoading;
}
export interface ProjectsFinishLoadingAction {
  type: ProjectsStateActionType.FinishLoading;
  payload: {
    data: Project[];
    defaultProject: Project;
  };
}

export interface ProjectsErrorAction {
  type: ProjectsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateProjectAction {
  type: ProjectsStateActionType.CreateProject;
  payload: {
    project: Project;
  };
}

export interface UpdateProjectAction {
  type: ProjectsStateActionType.UpdateProject;
  payload: {
    id: string;
    project: Partial<Project>;
  };
}

export interface UpdateOrderAction {
  type: ProjectsStateActionType.UpdateOrder;
  payload: {
    movedProjectId: string;
    overProjectId: string;
  };
}

export interface DeleteProjectAction {
  type: ProjectsStateActionType.DeleteProject;
  payload: {
    id: string;
  };
}

export type ProjectsStateAction =
  | ProjectsLoadAction
  | ProjectsFinishLoadingAction
  | ProjectsErrorAction
  | CreateProjectAction
  | UpdateProjectAction
  | DeleteProjectAction
  | UpdateOrderAction;
