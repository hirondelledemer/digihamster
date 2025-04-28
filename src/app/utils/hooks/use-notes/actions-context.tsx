import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Note } from "@/models/note";

interface NoteActionsContextValue {
  createNote(note: FieldsRequired, onDone?: () => void): void;
  updateNote(id: string, note: Partial<Note>, onDone?: () => void): void;
  deleteNote(id: string, onDone?: () => void): void;
}

const DEFAULT_NOTES_ACTIONS: NoteActionsContextValue = {
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
} as const;

export const NotesActionsContext = createContext<NoteActionsContextValue>(
  DEFAULT_NOTES_ACTIONS
);

export const useNotesActions = () => useContext(NotesActionsContext);
