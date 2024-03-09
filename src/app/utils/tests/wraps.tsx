import { Project } from "@/models/project";
import { ProjectsContext } from "../hooks/use-projects";
import { TasksContext } from "../hooks/use-tasks";
import { Task } from "@/models/task";

export const wrapWithProjectsProvider = (
  component: JSX.Element,
  value: {
    projects: Project[];
    defaultProject?: Project;
  }
) => (
  <ProjectsContext.Provider
    value={{
      data: value.projects,
      defaultProject: value.defaultProject,
      loading: false,
      setData: jest.fn(),
    }}
  >
    {component}
  </ProjectsContext.Provider>
);

export const wrapWithTasksProvider = (
  component: JSX.Element,
  value: {
    data: Task[];
  }
) => (
  <TasksContext.Provider
    value={{
      data: value.data,
      loading: false,
      setData: jest.fn(),
    }}
  >
    {component}
  </TasksContext.Provider>
);
