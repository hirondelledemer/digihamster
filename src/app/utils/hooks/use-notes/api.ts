import apiClient from "../../api-client";
import { INote } from "../../types/note";

export type FieldsRequired = Pick<INote, "title" | "content" | "json_content">;

export type CreateNoteParams = FieldsRequired & { parentTaskId?: string };

export const api = {
  getNotes: () => apiClient.get<INote[]>("/notes"),
  createNote: (data: CreateNoteParams) => apiClient.post<INote>("/notes", data),
  updateNote: (id: number, props: Partial<INote>) =>
    apiClient.patch(`/notes/${id}`, props),
  deleteNote: (id: number) => apiClient.delete(`/notes/${id}`),
} as const;
