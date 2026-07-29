import { IProject } from "../../types/project";

export interface ProjectsState {
  data: IProject[];
  defaultProject: IProject | null;
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
    data: IProject[];
    defaultProject?: IProject;
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
    project: IProject;
  };
}

export interface UpdateProjectAction {
  type: ProjectsStateActionType.UpdateProject;
  payload: {
    id: number;
    project: Partial<IProject>;
  };
}

export interface UpdateOrderAction {
  type: ProjectsStateActionType.UpdateOrder;
  payload: {
    movedProjectId: number;
    overProjectId: number;
  };
}

export interface DeleteProjectAction {
  type: ProjectsStateActionType.DeleteProject;
  payload: {
    id: number;
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
