import { Habit } from "@/models/habit";

export interface HabitsNewState {
  data: Habit[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum HabitsNewActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateHabit = "CREATE_HABIT",
  UpdateHabit = "UPDATE_HABIT",
  DeleteHabit = "DELETE_HABIT",
  UpsertLog = "UPSERT_LOG",
}

export interface StartLoadingAction {
  type: HabitsNewActionType.StartLoading;
}
export interface FinishLoadingAction {
  type: HabitsNewActionType.FinishLoading;
  payload: { data: Habit[] };
}
export interface ErrorAction {
  type: HabitsNewActionType.Error;
  payload: { errorMessage: unknown };
}
export interface CreateHabitAction {
  type: HabitsNewActionType.CreateHabit;
  payload: { habit: Habit };
}
export interface UpdateHabitAction {
  type: HabitsNewActionType.UpdateHabit;
  payload: { id: string; habit: Partial<Habit> };
}
export interface DeleteHabitAction {
  type: HabitsNewActionType.DeleteHabit;
  payload: { id: string };
}
export interface UpsertLogAction {
  type: HabitsNewActionType.UpsertLog;
  payload: { habitId: string; logDate: string; completed: boolean };
}

export type HabitsNewAction =
  | StartLoadingAction
  | FinishLoadingAction
  | ErrorAction
  | CreateHabitAction
  | UpdateHabitAction
  | DeleteHabitAction
  | UpsertLogAction;
