"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Note } from "@/models/note";

export const NotesContext = createContext<{
  data: Note[];
  setData: Dispatch<SetStateAction<Note[]>>;
}>({
  data: [],
  setData: () => {},
});

const { Provider } = NotesContext;

export const NotesContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Note[]>([]);
  // todo: look into utilising this
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const notesResponse = await axios.get<Note[]>(
          "/api/notes?isActive=true"
        );
        setData(notesResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <Provider value={{ data, setData }}>{children}</Provider>;
};

export default function useNotes() {
  const { data, setData } = useContext(NotesContext);

  return { data, setData };
}
