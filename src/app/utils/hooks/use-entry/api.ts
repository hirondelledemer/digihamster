import apiClient from "../../api-client";
import { IJournalEntry } from "../../types/journal-entry";

export type FieldsRequired = Pick<
  IJournalEntry,
  "title" | "note" | "json_note"
>;

export type CreateEntryParams = FieldsRequired & { jsonNote: object };

export const api = {
  getEntries: () => apiClient.get<IJournalEntry[]>("/journal-entries"),
  createEntry: (data: CreateEntryParams) =>
    apiClient.post<IJournalEntry>("/journal-entries", data),
  updateEntry: (id: number, props: Partial<IJournalEntry>) =>
    apiClient.patch(`/journal-entries/${id}`, props),
  deleteEntry: (id: number) => apiClient.delete(`/journal-entries/${id}`),
} as const;
