import axios from "axios";

import apiClient from "../../api-client";
import { IProject } from "../../types/project";

export type FieldsRequired = Pick<
  IProject,
  "title" | "color" | "life_aspect_id"
>;

const PROJECTS_PATH = "/projects";

export const getProjectsPath = (id: number) => `${PROJECTS_PATH}/${id}`;

export const api = {
  getProjects: () => apiClient.get<IProject[]>("/projects"),
  createProject: (data: FieldsRequired) =>
    apiClient.post<IProject>(PROJECTS_PATH, data),
  updateProject: (id: number, props: Partial<IProject>) =>
    apiClient.patch(getProjectsPath(id), props),
  deleteProject: (id: number) => axios.delete(getProjectsPath(id)),
} as const;
