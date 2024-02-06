import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { IJournalEntry } from "@/models/entry";

export const EntriesContext = createContext<{
  data: IJournalEntry[];
  setData: Dispatch<SetStateAction<IJournalEntry[]>>;
}>({
  data: [],
  setData: () => {},
});

const { Provider } = EntriesContext;

export const EntriesContextProvider = ({ children }: any) => {
  const [data, setData] = useState<IJournalEntry[]>([]);
  // todo: look into utilising this
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const journalEntriesResponse = await axios.get<{
          data: IJournalEntry[];
        }>("/api/entries");
        setData(journalEntriesResponse.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <Provider value={{ data, setData }}>{children}</Provider>;
};

export default function useJournalEntries() {
  const { data, setData } = useContext(EntriesContext);

  return { data, setData };
}
