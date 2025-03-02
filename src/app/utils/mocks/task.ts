import { TaskWithRelatedTasks } from "../types/task";

export const generateTask: (
  i?: number,
  properties?: Partial<TaskWithRelatedTasks>
) => TaskWithRelatedTasks = (i = 1, properties) => {
  return {
    _id: `task${i}`,
    title: `Task ${i}`,
    description: `task description ${i}`,
    completed: false,
    isActive: false,
    deleted: false,
    projectId: "project1",
    estimate: 0,
    sortOrder: 0,
    event: null,
    completedAt: 0,
    activatedAt: 0,
    parentTaskId: null,
    tags: [],
    createdAt: "",
    updatedAt: "",
    deadline: null,
    relatedTasks: [],
    ...properties,
  };
};

export const generateListOfTasks: (count: number) => TaskWithRelatedTasks[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateTask(i));
};

export const generateCustomTasksList: (
  taskInfo: Partial<TaskWithRelatedTasks>[]
) => TaskWithRelatedTasks[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateTask(i, taskProperties),
  }));
};
