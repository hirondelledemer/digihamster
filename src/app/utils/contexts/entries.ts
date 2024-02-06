import { IJournalEntry } from "@/models/entry";
import { createContext } from "react";

export const JournalEntriesContext = createContext<IJournalEntry[]>([]);
