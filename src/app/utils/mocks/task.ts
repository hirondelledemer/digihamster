import { TaskWithRelations } from "../types/task";

export const generateTask: (
  i?: number,
  properties?: Partial<TaskWithRelations>
) => TaskWithRelations = (i = 1, properties) => {
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
    relatedTaskIds: [],
    relatedNoteIds: [],
    ...properties,
  };
};

export const generateListOfTasks: (count: number) => TaskWithRelations[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateTask(i));
};

export const generateCustomTasksList: (
  taskInfo: Partial<TaskWithRelations>[]
) => TaskWithRelations[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateTask(i, taskProperties),
  }));
};
