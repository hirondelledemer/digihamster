import apiClient from "../../api-client";
import { ITask } from "../../types/task";

export type CreateTaskParams = {
  title: string;
  project_id?: number;
  description?: string;
  status?: "todo" | "doing";
  deadline?: string;
};

export const TASKS_PATH = "/tasks";

export const getTasksPath = (id: number) => `${TASKS_PATH}/${id}`;

export const api = {
  getTasks: () => apiClient.get<ITask[]>("/tasks"),
  createTask: (data: CreateTaskParams) =>
    apiClient.post<ITask>(TASKS_PATH, data),
  updateTask: (id: number, data: Partial<ITask>) =>
    apiClient.patch<ITask>(getTasksPath(id), data),
  deleteTask: (id: number) => apiClient.delete(getTasksPath(id)),
} as const;
