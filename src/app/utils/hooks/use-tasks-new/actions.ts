import { TaskV2 } from "@/models/taskV2";

export interface TasksNewState {
  data: TaskV2[];
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
  payload: { data: TaskV2[] };
}
export interface ErrorAction {
  type: TasksNewActionType.Error;
  payload: { errorMessage: unknown };
}
export interface CreateTaskAction {
  type: TasksNewActionType.CreateTask;
  payload: { task: TaskV2 };
}
export interface UpdateTaskAction {
  type: TasksNewActionType.UpdateTask;
  payload: { id: string; task: Partial<TaskV2> };
}
export interface DeleteTaskAction {
  type: TasksNewActionType.DeleteTask;
  payload: { id: string };
}

export type TasksNewAction =
  | StartLoadingAction
  | FinishLoadingAction
  | ErrorAction
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction;
