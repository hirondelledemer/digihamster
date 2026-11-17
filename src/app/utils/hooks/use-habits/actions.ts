import { IHabitWithLogs } from "../../types/habit";

export interface HabitsState {
  data: IHabitWithLogs[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum HabitsActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateHabit = "CREATE_HABIT",
  UpdateHabit = "UPDATE_HABIT",
  DeleteHabit = "DELETE_HABIT",
  UpsertLog = "UPSERT_LOG",
}

export interface StartLoadingAction {
  type: HabitsActionType.StartLoading;
}
export interface FinishLoadingAction {
  type: HabitsActionType.FinishLoading;
  payload: { data: IHabitWithLogs[] };
}
export interface ErrorAction {
  type: HabitsActionType.Error;
  payload: { errorMessage: unknown };
}
export interface CreateHabitAction {
  type: HabitsActionType.CreateHabit;
  payload: { habit: IHabitWithLogs };
}
export interface UpdateHabitAction {
  type: HabitsActionType.UpdateHabit;
  payload: { id: number; habit: Partial<IHabitWithLogs> };
}
export interface DeleteHabitAction {
  type: HabitsActionType.DeleteHabit;
  payload: { id: number };
}
export interface UpsertLogAction {
  type: HabitsActionType.UpsertLog;
  payload: { habitId: number; logDate: string; completed: boolean };
}

export type HabitsAction =
  | StartLoadingAction
  | FinishLoadingAction
  | ErrorAction
  | CreateHabitAction
  | UpdateHabitAction
  | DeleteHabitAction
  | UpsertLogAction;
