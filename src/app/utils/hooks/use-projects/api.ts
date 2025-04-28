import axios from "axios";
import { Project } from "@/models/project";

export type FieldsRequired = Pick<
  Project,
  "title" | "color" | "disabled" | "jsonDescription"
>;
export const api = {
  getProjects: () =>
    axios.get<{
      projects: Project[];
      defaultProject: Project;
    }>("/api/projects"),
  createProject: (data: FieldsRequired) =>
    axios.post<Project>("/api/projects", data),
  updateProject: (id: string, props: Partial<Project>) =>
    axios.patch("/api/projects", { id, ...props }),
  deleteProject: (id: string) =>
    axios.patch("/api/projects", { id, deleted: true }),
  updateOrder: (params: {
    sortOrder: { projectId: string; order: number }[];
  }) => axios.patch("/api/projects/sort", params),
} as const;
