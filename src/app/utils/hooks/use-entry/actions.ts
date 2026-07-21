import { IJournalEntry } from "../../types/journal-entry";

export interface EntriesState {
  data: IJournalEntry[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum EntriesStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateEntry = "CREATE_ENTRY",
  UpdateEntry = "UPDATE_ENTRY",
  DeleteEntry = "DELETE_ENTRY",
}

export interface EntriesLoadAction {
  type: EntriesStateActionType.StartLoading;
}
export interface EntriesFinishLoadingAction {
  type: EntriesStateActionType.FinishLoading;
  payload: {
    data: IJournalEntry[];
  };
}

export interface EntriesErrorAction {
  type: EntriesStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateEntryAction {
  type: EntriesStateActionType.CreateEntry;
  payload: {
    entry: IJournalEntry;
  };
}

export interface UpdateEntryAction {
  type: EntriesStateActionType.UpdateEntry;
  payload: {
    id: number;
    entry: Partial<IJournalEntry>;
  };
}
export interface DeleteEntryAction {
  type: EntriesStateActionType.DeleteEntry;
  payload: {
    id: number;
  };
}

export type EntriesStateAction =
  | EntriesLoadAction
  | EntriesFinishLoadingAction
  | EntriesErrorAction
  | CreateEntryAction
  | UpdateEntryAction
  | DeleteEntryAction;
