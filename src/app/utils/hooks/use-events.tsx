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
import { Task } from "@/models/task";
import { useToast } from "@/app/components/ui/use-toast";

export const EventsContext = createContext<{
  data: Task[];
  setData: Dispatch<SetStateAction<Task[]>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  error: undefined,
  loading: false,
});

const { Provider } = EventsContext;

export const EventsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Task[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const eventsResponse = await axios.get<{
          data: Task[];
        }>("/api/tasks/events");
        setData(eventsResponse.data.data);
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
