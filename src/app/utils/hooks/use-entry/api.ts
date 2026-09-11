import apiClient from "../../api-client";
import { IJournalEntry } from "../../types/journal-entry";

export type FieldsRequired = Pick<
  IJournalEntry,
  "title" | "note" | "json_note"
>;

export type CreateEntryParams = FieldsRequired & {
  mentioned_people_ids: number[];
};

export type UpdateEntryParams = Partial<IJournalEntry> & {
  mentioned_people_ids: number[];
};

export const JOURNAL_ENTRIES_PATH = "/journal-entries";

export const getJournalEntriesPath = (id: number) =>
  `${JOURNAL_ENTRIES_PATH}/${id}`;

export const api = {
  getEntries: () => apiClient.get<IJournalEntry[]>(JOURNAL_ENTRIES_PATH),
  createEntry: (data: CreateEntryParams) =>
    apiClient.post<IJournalEntry>(JOURNAL_ENTRIES_PATH, data),
  updateEntry: (id: number, props: UpdateEntryParams) =>
    apiClient.patch(getJournalEntriesPath(id), props),
  deleteEntry: (id: number) => apiClient.delete(getJournalEntriesPath(id)),
} as const;
