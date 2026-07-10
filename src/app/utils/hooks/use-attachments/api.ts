import { Attachment } from "@/models/attachment";
import apiClient from "../../api-client";

export interface ListParams {
  entity_type?: string;
  entity_id?: string;
}

export const api = {
  list: (params?: ListParams) =>
    apiClient.get<Attachment[]>("/attachments", { params }),
  get: (id: number) => apiClient.get<Attachment>(`/attachments/${id}`),
  upload: (file: File, entity_type: string, entity_id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entity_type", entity_type);
    formData.append("entity_id", entity_id);
    return apiClient.post<Attachment>("/attachments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  download: (id: number) =>
    apiClient.get<Blob>(`/attachments/${id}/download`, {
      responseType: "blob",
    }),
  remove: (id: number) => apiClient.delete(`/attachments/${id}`),
} as const;
