import apiClient from "../../api-client";
import { IJournalEntry } from "../../types/journal-entry";

export type JournalRequestParams = Pick<
  IJournalEntry,
  "title" | "note" | "json_note"
> & {
  mentioned_people_ids: number[];
};

export type UpdateEntryRequestParams = Partial<JournalRequestParams>;

export const JOURNAL_ENTRIES_PATH = "/journal-entries";

export const getJournalEntriesPath = (id: number) =>
  `${JOURNAL_ENTRIES_PATH}/${id}`;

export const api = {
  getEntries: () => apiClient.get<IJournalEntry[]>(JOURNAL_ENTRIES_PATH),
  createEntry: (data: JournalRequestParams) =>
    apiClient.post<IJournalEntry>(JOURNAL_ENTRIES_PATH, data),
  updateEntry: (id: number, props: UpdateEntryRequestParams) =>
    apiClient.patch(getJournalEntriesPath(id), props),
  deleteEntry: (id: number) => apiClient.delete(getJournalEntriesPath(id)),
} as const;
