import { JournalEntry } from "@/models/entry";

export const generateJournalEntry: (
  i?: number,
  properties?: Partial<JournalEntry>
) => JournalEntry = (i = 1, properties) => {
  return {
    _id: `entry${i}`,
    title: `Entry ${i}`,
    note: `entry ${i} note`,
    updatedAt: "",
    tags: [],
    ...properties,
  };
};

export const generateListOfJournalEntries: (count: number) => JournalEntry[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateJournalEntry(i));
};

export const generateCustomListOfJournalEntries: (
  entryInfo: Partial<JournalEntry>[]
) => JournalEntry[] = (entryInfo) => {
  return entryInfo.map((entryProperties, i) => ({
    ...generateJournalEntry(i, entryProperties),
  }));
};
