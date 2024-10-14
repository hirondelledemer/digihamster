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
import { updateObjById } from "../common/update-array";
import { arrayMove } from "@dnd-kit/sortable";

type FieldsRequired = "title" | "color" | "disabled";

export interface ProjectsContextValue {
  data: Project[];
  defaultProject?: Project;
  setData: Dispatch<SetStateAction<Project[]>>;
  error?: unknown;
  loading: boolean;
  updateProject(id: string, props: Partial<Project>, onDone?: () => void): void;
  updateProjectsOrder(
    movedProjectId: string,
    overProjectId: string,
    onDone?: () => void
  ): void;
  createProject(data: Pick<Project, FieldsRequired>): void;
  getProjectById(id: string): Project;
}

export const ProjectsContext = createContext<ProjectsContextValue>({
  data: [],
  setData: () => {},
  loading: false,
  updateProject: () => {},
  createProject: () => {},
  updateProjectsOrder: () => {},
  getProjectById: () => {
    return null as unknown as Project;
  },
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

  const createProject = async (data: Pick<Project, FieldsRequired>) => {
    const tempId = "temp-id";

    const tempProject: Project = {
      _id: tempId,
      deleted: false,
      order: 0,
      ...data,
    };
    setData((e) => [...e, tempProject]);

    try {
      const response = await axios.post<Project>("/api/projects", data);
      setData((e) => updateObjById<Project>(e, tempId, response.data));
      toast({
        title: "Success",
        description: "Project has been created",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const updateProject = async (
    projectId: string,
    props: Partial<Project>,
    onDone?: () => void
  ) => {
    try {
      setData((p) =>
        updateObjById<Project>(p, projectId, {
          ...props,
        })
      );
      onDone && onDone();
      await axios.patch("/api/projects", {
        id: projectId,
        ...props,
      });
      toast({
        title: "Success",
        description: "Project has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const updateProjectsOrder = async (
    movedProjectId: string,
    overProjectId: string,
    onDone?: () => void
  ) => {
    try {
      const oldIndex = data.findIndex((p) => p._id === movedProjectId);
      const newIndex = data.findIndex((p) => p._id === overProjectId);
      const newArray = arrayMove(data, oldIndex, newIndex);

      setData(newArray);
      onDone && onDone();
      await axios.patch("/api/projects/sort", {
        sortOrder: newArray.map((p, index) => ({
          projectId: p._id,
          order: index,
        })),
      });
      toast({
        title: "Success",
        description: "Project order been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const getProjectById = (id: string) => {
    const project = data.find((project) => project._id === id);
    if (!project) {
      throw Error("no project by this id");
    }

    return project;
  };

  return (
    <Provider
      value={{
        data,
        setData,
        error,
        loading,
        defaultProject,
        updateProject,
        createProject,
        updateProjectsOrder,
        getProjectById,
      }}
    >
      {children}
    </Provider>
  );
};

export default function useProjects() {
  const {
    data,
    setData,
    defaultProject,
    updateProject,
    createProject,
    updateProjectsOrder,
    getProjectById,
    loading,
  } = useContext(ProjectsContext);

  return {
    data,
    setData,
    defaultProject,
    updateProject,
    createProject,
    updateProjectsOrder,
    getProjectById,
    loading,
  };
}
