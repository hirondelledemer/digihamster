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
  defaultProject?: Project;
  setData: Dispatch<SetStateAction<Project[]>>;
  error?: unknown;
  loading: boolean;
}>({
  data: [],
  setData: () => {},
  loading: false,
});

const { Provider } = ProjectsContext;

export const ProjectsContextProvider = ({ children }: any) => {
  const [data, setData] = useState<Project[]>([]);
  const [defaultProject, setDefaultProject] = useState<Project>();
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const projectsResponse = await axios.get<{
          projects: Project[];
          defaultProject: Project;
        }>("/api/projects");
        setData(projectsResponse.data.projects);
        setDefaultProject(projectsResponse.data.defaultProject);
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
    <Provider value={{ data, setData, error, loading, defaultProject }}>
      {children}
    </Provider>
  );
};

export default function useProjects() {
  const { data, setData, defaultProject } = useContext(ProjectsContext);

  return { data, setData, defaultProject };
}
