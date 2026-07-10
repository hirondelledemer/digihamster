import { TasksContext, TasksContextValues } from "../hooks/use-tasks";
import { Tag } from "@/models/tag";
import { TagsStateContext } from "../hooks/use-tags/state-context";

import { generateListOfTasks } from "../mocks/task";
import { generateListOfJournalEntries } from "../mocks/journal-entry";
import { EntriesStateContext } from "../hooks/use-entry/state-context";
import { EntriesState } from "../hooks/use-entry/actions";
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
  <TagsStateContext.Provider
    value={{
      data: value,
      isLoading: false,
    }}
  >
    {component}
  </TagsStateContext.Provider>
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
const defaultEntriesValue: EntriesState = {
  data: defaultEntries,
  isLoading: false,
};

export const wrapWithEntriesProvider = (
  component: JSX.Element,
  value?: Partial<EntriesState>
) => (
  <EntriesStateContext.Provider
    value={{
      ...defaultEntriesValue,
      ...value,
    }}
  >
    {component}
  </EntriesStateContext.Provider>
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
