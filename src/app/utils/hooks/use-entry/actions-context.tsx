import { createContext, useContext } from "react";
import { JournalRequestParams } from "./api";
import { IJournalEntry } from "../../types/journal-entry";
import { ActionsContextValue } from "../use-crud/actions-context";

type EntryActionsContextValue = ActionsContextValue<
  JournalRequestParams,
  IJournalEntry
>;

const DEFAULT_ENTRIES_ACTIONS: EntryActionsContextValue = {
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const EntriesActionsContext = createContext<EntryActionsContextValue>(
  DEFAULT_ENTRIES_ACTIONS
);

export const useEntriesActions = () => useContext(EntriesActionsContext);
