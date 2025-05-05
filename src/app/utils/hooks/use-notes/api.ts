import axios from "axios";
import { Note } from "@/models/note";

export type FieldsRequired = Pick<Note, "title" | "note" | "tags" | "jsonNote">;

export type CreateNoteParams = FieldsRequired & { parentTaskId?: string };

export const api = {
  getNotes: () => axios.get<Note[]>("/api/notes"),
  createNote: (data: CreateNoteParams) => axios.post<Note>("/api/notes", data),
  updateNote: (id: string, props: Partial<Note>) =>
    axios.patch("/api/notes", { id, ...props }),
  deleteNote: (id: string) => axios.patch("/api/notes", { id, deleted: true }),
} as const;
