import JournalEntriesManager from "../components/JournalEntriesManager";
import { EntriesContextProvider } from "../utils/hooks/use-entry/provider";
import { TagsContextProvider } from "../utils/hooks/use-tags/provider";

export default function JournalPage() {
  return (
    <TagsContextProvider>
      <EntriesContextProvider>
        <JournalEntriesManager />
      </EntriesContextProvider>
    </TagsContextProvider>
  );
}
