import { IJournalEntry } from "../types/journal-entry";
import { DEFAULT_TEST_DATE } from "./date";

export const generateJournalEntry: (
  i?: number,
  properties?: Partial<IJournalEntry>,
) => IJournalEntry = (i = 1, properties) => {
  return {
    id: i,
    title: `Entry ${i}`,
    note: `entry ${i} note`,
    json_note: {},
    created_at: DEFAULT_TEST_DATE,
    ...properties,
  };
};

export const generateListOfJournalEntries: (
  count: number,
) => IJournalEntry[] = (count) => {
  return [...Array(count)].map((_v, i) => generateJournalEntry(i));
};

export const generateCustomListOfJournalEntries: (
  entryInfo: Partial<IJournalEntry>[],
) => IJournalEntry[] = (entryInfo) => {
  return entryInfo.map((entryProperties, i) => ({
    ...generateJournalEntry(i, entryProperties),
  }));
};
