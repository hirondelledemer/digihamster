import { createContext, useContext } from "react";
import { NotesState } from "./actions";

type NotesContextValue = NotesState;

const DEFAULT_NOTES_STATE: NotesState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const NotesStateContext =
  createContext<NotesContextValue>(DEFAULT_NOTES_STATE);

export const useNotesState = () => useContext(NotesStateContext);
