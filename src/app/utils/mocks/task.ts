import { ITask, TaskStatus } from "../types/task";
import { DEFAULT_TEST_DATE } from "./date";

export const generateTask: (
  i?: number,
  properties?: Partial<ITask>,
) => ITask = (i = 1, properties) => {
  return {
    id: i,
    title: `Task ${i}`,
    description: `task description ${i}`,
    status: TaskStatus.Todo,
    project_id: null,
    event_id: null,
    completed_at: null,
    activated_at: null,
    created_at: DEFAULT_TEST_DATE,
    deadline: null,
    ...properties,
  };
};

export const generateListOfTasks: (count: number) => ITask[] = (count) => {
  return [...Array(count)].map((_v, i) => generateTask(i));
};

export const generateCustomTasksList: (
  taskInfo: Partial<ITask>[],
) => ITask[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateTask(i, taskProperties),
  }));
};
