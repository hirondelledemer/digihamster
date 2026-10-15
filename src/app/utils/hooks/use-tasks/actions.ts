import { ITask } from "../../types/task";

export interface TasksNewState {
  data: ITask[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum TasksNewActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateTask = "CREATE_TASK",
  UpdateTask = "UPDATE_TASK",
  DeleteTask = "DELETE_TASK",
}

export interface StartLoadingAction {
  type: TasksNewActionType.StartLoading;
}
export interface FinishLoadingAction {
  type: TasksNewActionType.FinishLoading;
  payload: { data: ITask[] };
}
export interface ErrorAction {
  type: TasksNewActionType.Error;
  payload: { errorMessage: unknown };
}
export interface CreateTaskAction {
  type: TasksNewActionType.CreateTask;
  payload: { task: ITask };
}
export interface UpdateTaskAction {
  type: TasksNewActionType.UpdateTask;
  payload: { id: number; task: Partial<ITask> };
}
export interface DeleteTaskAction {
  type: TasksNewActionType.DeleteTask;
  payload: { id: number };
}

export type TasksNewAction =
  | StartLoadingAction
  | FinishLoadingAction
  | ErrorAction
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction;
