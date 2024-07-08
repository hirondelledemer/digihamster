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
import { Event } from "@/models/event";
import { useToast } from "@/app/components/ui/use-toast";

export const EventsContext = createContext<{
  data: Event[];
  setData: Dispatch<SetStateAction<Event[]>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  error: undefined,
  loading: false,
});

const { Provider } = EventsContext;

/*
  todo: 
  because of the tasks with the deadline, events and tasks became related (task can become an event and vice versa if deadline is set)
  think about merging use-events and use-tasks
*/

export const EventsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Event[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const eventsResponse = await axios.get<Event[]>("/api/events");
        setData(eventsResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  return (
    <Provider value={{ data, setData, error, loading }}>{children}</Provider>
  );
};

export default function useEvents() {
  const { data, setData } = useContext(EventsContext);

  return { data, setData };
}
