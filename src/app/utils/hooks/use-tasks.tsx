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
import { TaskV2 as Task } from "@/models/taskV2";
import { useToast } from "@/app/components/ui/use-toast";

export interface TasksContextValues {
  data: Task[];
  setData: Dispatch<SetStateAction<Task[]>>;
  error?: unknown;
  loading: boolean;
}
export const TasksContext = createContext<TasksContextValues>({
  data: [],
  setData: () => {},
  error: undefined,
  loading: false,
});

const { Provider } = TasksContext;

export const TasksContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Task[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const tasksResponse = await axios.get<Task[]>("/api/tasks/v2");
        setData(tasksResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting tasks",
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

export default function useTasks() {
  const { data, setData, loading } = useContext(TasksContext);

  return { data, setData, loading };
}
