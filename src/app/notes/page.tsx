import NotesManager from "../components/NotesManager";
import { NotesContextProvider } from "../utils/hooks/use-notes/provider";
import { TagsContextProvider } from "../utils/hooks/use-tags/provider";

export default function NotesPage() {
  return (
    <TagsContextProvider>
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>
    </TagsContextProvider>
  );
}
