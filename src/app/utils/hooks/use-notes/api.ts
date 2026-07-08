import { Note } from "@/models/note";
import apiClient from "../../api-client";

export type FieldsRequired = Pick<
  Note,
  "title" | "note" | "tags" | "json_note"
>;

export type CreateNoteParams = FieldsRequired & { parentTaskId?: string };

export const api = {
  getNotes: () => apiClient.get<Note[]>("/notes"),
  createNote: (data: CreateNoteParams) => apiClient.post<Note>("/notes", data),
  updateNote: (id: string, props: Partial<Note>) =>
    apiClient.patch(`/notes/${id}`, props),
  deleteNote: (id: string) => apiClient.delete(`/notes/${id}`),
} as const;
