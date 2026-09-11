import JournalEntriesManager from "../components/JournalEntriesManager";
import { EntriesContextProvider } from "../utils/hooks/use-entry/provider";
import { PeopleContextProvider } from "../utils/hooks/use-people/provider";

export default function JournalPage() {
  return (
    <PeopleContextProvider>
      <EntriesContextProvider>
        <JournalEntriesManager />
      </EntriesContextProvider>
    </PeopleContextProvider>
  );
}
