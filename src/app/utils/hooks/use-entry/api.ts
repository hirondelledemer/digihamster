import { JournalEntry } from "@/models/entry";
import apiClient from "../../api-client";

export type FieldsRequired = Pick<
  JournalEntry,
  "title" | "note" | "tags" | "json_note"
>;

export type CreateEntryParams = FieldsRequired & { jsonNote: object };

export const api = {
  getEntries: () => apiClient.get<JournalEntry[]>("/journal-entries"),
  createEntry: (data: CreateEntryParams) =>
    apiClient.post<JournalEntry>("/journal-entries", data),
  updateEntry: (id: string, props: Partial<JournalEntry>) =>
    apiClient.patch(`/journal-entries/${id}`, props),
  deleteEntry: (id: string) => apiClient.delete(`/journal-entries/${id}`),
} as const;
