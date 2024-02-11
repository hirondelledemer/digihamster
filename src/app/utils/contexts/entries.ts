import { IJournalEntry } from "@/models/entry";
import { createContext } from "react";

// todo: fin out if this is used
export const JournalEntriesContext = createContext<IJournalEntry[]>([]);
