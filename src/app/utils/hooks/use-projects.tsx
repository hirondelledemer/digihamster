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
import { Project } from "@/models/project";
import { useToast } from "@/app/components/ui/use-toast";

export const ProjectsContext = createContext<{
  data: Project[];
  setData: Dispatch<SetStateAction<Project[]>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  error: undefined,
  loading: false,
});

const { Provider } = ProjectsContext;

export const ProjectsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Project[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const eventsResponse = await axios.get<Project[]>("/api/projects");
        setData(eventsResponse.data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "error while getting projects",
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

export default function useProjects() {
  const { data, setData } = useContext(ProjectsContext);

  return { data, setData };
}
