import { createContext, useContext } from "react";
import { CreateNoteParams } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { INote } from "../../types/note";

type NoteActionsContextValue = ActionsContextValue<CreateNoteParams, INote>;

const DEFAULT_NOTES_ACTIONS: NoteActionsContextValue = {
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const NotesActionsContext = createContext<NoteActionsContextValue>(
  DEFAULT_NOTES_ACTIONS
);

export const useNotesActions = () => useContext(NotesActionsContext);
