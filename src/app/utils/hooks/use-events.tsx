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
import { ITask } from "@/models/task";

export const EventsContext = createContext<{
  data: ITask[];
  setData: Dispatch<SetStateAction<ITask[]>>;
}>({
  data: [],
  setData: () => {},
});

const { Provider } = EventsContext;

export const EventsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<ITask[]>([]);
  // todo: look into utilising this
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const eventsResponse = await axios.get<{
          data: ITask[];
        }>("/api/tasks/events");
        setData(eventsResponse.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return <Provider value={{ data, setData }}>{children}</Provider>;
};

export default function useEvents() {
  const { data, setData } = useContext(EventsContext);

  return { data, setData };
}
