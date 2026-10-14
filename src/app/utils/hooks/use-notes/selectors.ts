import { INote } from "../../types/note";
import { useNotesState } from "./state-context";

export const useNoteById = (id: number | null | undefined): INote | null => {
  const { data } = useNotesState();

  if (id === null || id === undefined) {
    return null;
  }

  return data.find((note) => note.id === id) ?? null;
};
