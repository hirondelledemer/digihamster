import { Task } from "@/models/task";

export const generateTask: (propertes?: Partial<Task>) => Task = (
  propertes
) => {
  return {
    _id: "task1",
    title: "Task 1",
    description: "task description",
    completed: false,
    isActive: true,
    deleted: false,
    projectId: "project1",
    estimate: 0,
    sortOrder: 0,
    event: null,
    completedAt: 0,
    activatedAt: 0,
    parentTaskId: null,
    tags: ["tag1", "tag2"],
    createdAt: 0,
    updatedAt: 0,
    ...propertes,
  };
};

export const generateListOfTasks: (index: number) => Task[] = (index) => {
  return Array(index).map((_v, i) => ({
    _id: `task${i}`,
    title: `Task ${i}`,
    description: `task description ${i}`,
    completed: false,
    isActive: true,
    deleted: false,
    projectId: "project1",
    estimate: 0,
    sortOrder: 0,
    event: null,
    completedAt: 0,
    activatedAt: 0,
    parentTaskId: null,
    tags: ["tag1", "tag2"],
    createdAt: 0,
    updatedAt: 0,
  }));
};