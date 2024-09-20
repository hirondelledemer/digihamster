import { Project } from "@/models/project";
import { ProjectsContext, ProjectsContextValue } from "../hooks/use-projects";
import { TasksContext, TasksContextValues } from "../hooks/use-tasks";
import { TaskV2 as Task } from "@/models/taskV2";
import { Tag } from "@/models/tag";
import { TagsContext } from "../hooks/use-tags";
import { generateListOfProjects } from "../mocks/project";
import { generateListOfTasks } from "../mocks/task";

const defaultProjects = generateListOfProjects(5);
const defaultProject = defaultProjects[0];

const defaultProjectsValue: ProjectsContextValue = {
  data: defaultProjects,
  defaultProject,
  setData: jest.fn(),
  loading: false,
  updateProject: jest.fn(),
  updateProjectsOrder: jest.fn(),
  createProject: jest.fn(),
};

export const wrapWithProjectsProvider = (
  component: JSX.Element,
  value: Partial<ProjectsContextValue> = {}
) => (
  <ProjectsContext.Provider value={{ ...defaultProjectsValue, ...value }}>
    {component}
  </ProjectsContext.Provider>
);

export const wrapWithTagsProvider = (component: JSX.Element, value: Tag[]) => (
  <TagsContext.Provider
    value={{
      data: value,
      loading: false,
      setData: jest.fn(),
    }}
  >
    {component}
  </TagsContext.Provider>
);

const defaultTasks = generateListOfTasks(5);
const defaultTasksValue: TasksContextValues = {
  data: defaultTasks,
  setData: jest.fn(),
  loading: false,
};
export const wrapWithTasksProvider = (
  component: JSX.Element,
  value?: Partial<TasksContextValues>
) => (
  <TasksContext.Provider
    value={{
      ...defaultTasksValue,
      ...value,
    }}
  >
    {component}
  </TasksContext.Provider>
);
