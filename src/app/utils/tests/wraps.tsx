import { TasksContext, TasksContextValues } from "../hooks/use-tasks";
import { Tag } from "@/models/tag";
import { TagsContext } from "../hooks/use-tags";

import { generateListOfTasks } from "../mocks/task";
import { generateListOfJournalEntries } from "../mocks/journal-entry";
import { EntriesContext, EntriesContextValue } from "../hooks/use-entry";
import { HabitsContext, HabitsContextValue } from "../hooks/use-habits";
import { generateListOfHabits } from "../mocks/habit";

/* Projects */

// const defaultProjects = generateListOfProjects(5);
// const defaultProject = defaultProjects[0];

// const defaultProjectsValue: ProjectsContextValue = {
//   data: defaultProjects,
//   defaultProject,
//   setData: jest.fn(),
//   loading: false,
//   updateProject: jest.fn(),
//   updateProjectsOrder: jest.fn(),
//   createProject: jest.fn(),
//   getProjectById: jest.fn(),
// };

// export const wrapWithProjectsProvider = (
//   component: JSX.Element,
//   value: Partial<ProjectsContextValue> = {}
// ) => (
//   <ProjectsContext.Provider value={{ ...defaultProjectsValue, ...value }}>
//     {component}
//   </ProjectsContext.Provider>
// );

/* Tags */

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

/* Tasks */

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

/* Events */

// const defaultEvents = generateListOfEvents(5);
// const defaultEventsValue: EventsContextValues = {
//   data: defaultEvents,
//   setData: jest.fn(),
//   loading: false,
// };

// export const wrapWithEventProvider = (
//   component: JSX.Element,
//   value?: Partial<EventsContextValues>
// ) => (
//   <EventsContext.Provider
//     value={{
//       ...defaultEventsValue,
//       ...value,
//     }}
//   >
//     {component}
//   </EventsContext.Provider>
// );

/* Journal Entries  */

const defaultEntries = generateListOfJournalEntries(5);
const defaultEntriesValue: EntriesContextValue = {
  data: defaultEntries,
  setData: jest.fn(),
};

export const wrapWithEntriesProvider = (
  component: JSX.Element,
  value?: Partial<EntriesContextValue>
) => (
  <EntriesContext.Provider
    value={{
      ...defaultEntriesValue,
      ...value,
    }}
  >
    {component}
  </EntriesContext.Provider>
);

/* Habits */

const defaultHabits = generateListOfHabits(5);
const defaultHabitsValue: HabitsContextValue = {
  data: defaultHabits,
  setData: jest.fn(),
  loading: false,
  updateHabit: jest.fn(),
  deleteHabit: jest.fn(),
  addLog: jest.fn(),
  createHabit: jest.fn(),
};
export const wrapWithHabitsProvider = (
  component: JSX.Element,
  value?: Partial<HabitsContextValue>
) => (
  <HabitsContext.Provider
    value={{
      ...defaultHabitsValue,
      ...value,
    }}
  >
    {component}
  </HabitsContext.Provider>
);
