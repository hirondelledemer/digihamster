import { createContext, useContext } from "react";
import { CreateEntryParams } from "./api";
import { JournalEntry } from "@/models/entry";
import { ActionsContextValue } from "../use-crud/actions-context";

type EntryActionsContextValue = ActionsContextValue<
  CreateEntryParams,
  JournalEntry
>;

const DEFAULT_ENTRIES_ACTIONS: EntryActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
} as const;

export const EntriesActionsContext = createContext<EntryActionsContextValue>(
  DEFAULT_ENTRIES_ACTIONS
);

export const useEntriesActions = () => useContext(EntriesActionsContext);
