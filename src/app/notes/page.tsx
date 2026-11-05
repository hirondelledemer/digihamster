import NotesManager from "../components/NotesManager";
import { NotesContextProvider } from "../utils/hooks/use-notes/provider";
import { PeopleContextProvider } from "../utils/hooks/use-people/provider";

export default function NotesPage() {
  return (
    <PeopleContextProvider>
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>
    </PeopleContextProvider>
  );
}
