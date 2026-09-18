import { IJournalEntry } from "../../types/journal-entry";
import { RelationshipEntityType } from "../../types/relationship";
import { useRelationshipsState } from "../use-relationships/state-context";
import { useEntriesState } from "./state-context";

type GroupedJournalEntries = {
  [k in number | "loose"]: IJournalEntry[];
};

export const useJournalEntriesGroupedByEvents = ():
  | GroupedJournalEntries
  | undefined => {
  const { data: entries, isLoading: isEntriesLoading } = useEntriesState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (
    isEntriesLoading ||
    isRelationshipsLoading ||
    !entries ||
    !relationships
  ) {
    return undefined;
  }

  const expandedJournalEntries = entries.map((entry) => ({
    ...entry,
    event_id: relationships.find(
      (r) =>
        r.target_id === entry.id &&
        r.target_type === RelationshipEntityType.Journal &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const groupedJournalEntries =
    expandedJournalEntries.reduce<GroupedJournalEntries>(
      (acc, current) => {
        if (current.event_id !== undefined) {
          return {
            ...acc,
            [current.event_id]: [
              ...(acc[current.event_id] ? acc[current.event_id] : []),
              current,
            ],
          };
        }

        return {
          ...acc,
          loose: [...acc["loose"], current],
        };
      },
      { loose: [] }
    );

  return groupedJournalEntries;
};

export const useJournalEntriesForEvent = (eventId: number): IJournalEntry[] => {
  const { data: entries, isLoading: isEntriesLoading } = useEntriesState();
  const { data: relationships, isLoading: isRelationshipsLoading } =
    useRelationshipsState();

  if (
    isEntriesLoading ||
    isRelationshipsLoading ||
    !entries ||
    !relationships
  ) {
    return [];
  }

  const expandedJournalEntries = entries.map((entry) => ({
    ...entry,
    event_id: relationships.find(
      (r) =>
        r.target_id === entry.id &&
        r.target_type === RelationshipEntityType.Journal &&
        r.source_type === RelationshipEntityType.Event
    )?.source_id,
  }));

  const filteredEntries = expandedJournalEntries.filter(
    (entry) => entry.event_id === eventId
  );

  return filteredEntries;
};
