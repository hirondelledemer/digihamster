import { ITask } from "../../types/task";

export interface TasksState {
  data: ITask[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum TasksActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateTask = "CREATE_TASK",
  UpdateTask = "UPDATE_TASK",
  DeleteTask = "DELETE_TASK",
}

export interface StartLoadingAction {
  type: TasksActionType.StartLoading;
}
export interface FinishLoadingAction {
  type: TasksActionType.FinishLoading;
  payload: { data: ITask[] };
}
export interface ErrorAction {
  type: TasksActionType.Error;
  payload: { errorMessage: unknown };
}
export interface CreateTaskAction {
  type: TasksActionType.CreateTask;
  payload: { task: ITask };
}
export interface UpdateTaskAction {
  type: TasksActionType.UpdateTask;
  payload: { id: number; task: Partial<ITask> };
}
export interface DeleteTaskAction {
  type: TasksActionType.DeleteTask;
  payload: { id: number };
}

export type TasksAction =
  | StartLoadingAction
  | FinishLoadingAction
  | ErrorAction
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction;
