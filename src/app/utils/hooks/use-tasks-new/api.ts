import apiClient from "../../api-client";
import { TaskV2 } from "@/models/taskV2";

export type CreateTaskParams = {
  title: string;
  project_id: number;
};

export const api = {
  getTasks: () => apiClient.get<TaskV2[]>("/tasks"),
  createTask: (data: CreateTaskParams) =>
    apiClient.post<TaskV2>("/tasks", data),
  updateTask: (id: string, data: Partial<TaskV2>) =>
    apiClient.patch<TaskV2>(`/tasks/${id}`, data),
  deleteTask: (id: string) => apiClient.delete(`/tasks/${id}`),
} as const;
