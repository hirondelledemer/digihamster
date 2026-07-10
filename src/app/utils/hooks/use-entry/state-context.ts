import { createContext, useContext } from "react";
import { EntriesState } from "./actions";

type EntriesContextValue = EntriesState;

const DEFAULT_ENTRIES_STATE: EntriesState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const EntriesStateContext =
  createContext<EntriesContextValue>(DEFAULT_ENTRIES_STATE);

export const useEntriesState = () => useContext(EntriesStateContext);
