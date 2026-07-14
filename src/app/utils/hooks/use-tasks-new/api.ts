import apiClient from "../../api-client";
import { TaskV2 } from "@/models/taskV2";

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
  getTasks: () => apiClient.get<TaskV2[]>("/tasks"),
  createTask: (data: CreateTaskParams) =>
    apiClient.post<TaskV2>(TASKS_PATH, data),
  updateTask: (id: number, data: Partial<TaskV2>) =>
    apiClient.patch<TaskV2>(getTasksPath(id), data),
  deleteTask: (id: number) => apiClient.delete(getTasksPath(id)),
} as const;
