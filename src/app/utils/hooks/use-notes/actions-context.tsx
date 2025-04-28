import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Note } from "@/models/note";
import { ActionsContextValue } from "../use-crud/actions-context";

type NoteActionsContextValue = ActionsContextValue<FieldsRequired, Note>;

const DEFAULT_NOTES_ACTIONS: NoteActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
} as const;

export const NotesActionsContext = createContext<NoteActionsContextValue>(
  DEFAULT_NOTES_ACTIONS
);

export const useNotesActions = () => useContext(NotesActionsContext);
