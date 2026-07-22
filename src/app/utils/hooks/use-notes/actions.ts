import { INote } from "../../types/note";

export interface NotesState {
  data: INote[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum NotesStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateNote = "CREATE_NOTE",
  UpdateNote = "UPDATE_NOTE",
  DeleteNote = "DELETE_NOTE",
}

export interface NotesLoadAction {
  type: NotesStateActionType.StartLoading;
}
export interface NotesFinishLoadingAction {
  type: NotesStateActionType.FinishLoading;
  payload: {
    data: INote[];
  };
}

export interface NotesErrorAction {
  type: NotesStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateNoteAction {
  type: NotesStateActionType.CreateNote;
  payload: {
    note: INote;
  };
}

export interface UpdateNoteAction {
  type: NotesStateActionType.UpdateNote;
  payload: {
    id: number;
    note: Partial<INote>;
  };
}
export interface DeleteNoteAction {
  type: NotesStateActionType.DeleteNote;
  payload: {
    id: number;
  };
}

export type NotesStateAction =
  | NotesLoadAction
  | NotesFinishLoadingAction
  | NotesErrorAction
  | CreateNoteAction
  | UpdateNoteAction
  | DeleteNoteAction;
