import axios from "axios";
import { Project } from "@/models/project";
import apiClient from "../../api-client";

export type FieldsRequired = Pick<
  Project,
  "title" | "color" | "life_aspect_id"
>;
export const api = {
  getProjects: () => apiClient.get<Project[]>("/projects"),
  createProject: (data: FieldsRequired) =>
    apiClient.post<Project>("/projects", data),
  updateProject: (id: string, props: Partial<Project>) =>
    apiClient.patch(`/projects/${id}`, props),
  deleteProject: (id: string) =>
    axios.patch("/projects", { id, deleted: true }),
  // updateOrder: (params: {
  //   sortOrder: { projectId: string; order: number }[];
  // }) => axios.patch("/api/projects/sort", params),
} as const;
