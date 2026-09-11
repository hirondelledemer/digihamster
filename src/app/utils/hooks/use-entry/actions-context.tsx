import { createContext, useContext } from "react";
import { CreateEntryParams, UpdateEntryParams } from "./api";
import { IJournalEntry } from "../../types/journal-entry";

type EntryActionsContextValue = {
  create(
    note: CreateEntryParams,
    onDone?: () => void
  ): Promise<IJournalEntry | null>;
  update(id: number, entity: UpdateEntryParams, onDone?: () => void): void;
  delete(id: number, onDone?: () => void): void;
};

const DEFAULT_ENTRIES_ACTIONS: EntryActionsContextValue = {
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const EntriesActionsContext = createContext<EntryActionsContextValue>(
  DEFAULT_ENTRIES_ACTIONS
);

export const useEntriesActions = () => useContext(EntriesActionsContext);
