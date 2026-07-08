import { Tag } from "@/models/tag";
import apiClient from "../../api-client";

export type FieldsRequired = Pick<Tag, "title" | "color">;

export type CreateTagParams = FieldsRequired;

export const api = {
  getTags: () => apiClient.get<Tag[]>("/tags"),
  createTag: (data: CreateTagParams) => apiClient.post<Tag>("/tags", data),
  updateTag: (id: string, props: Partial<Tag>) =>
    apiClient.patch("/tags", { id, ...props }),
  deleteTag: (id: string) => apiClient.patch("/tags", { id, deleted: true }),
} as const;
