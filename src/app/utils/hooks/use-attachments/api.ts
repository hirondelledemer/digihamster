import { IAttachment } from "../../types/attachment";
import apiClient from "../../api-client";
import { CrudApi } from "../use-crud/api";

export const ATTACHMENTS_PATH = "/attachments";

/**
 * An attachment is created by uploading a file, so there is nothing else to
 * send. What it belongs to is a relationship row, not a column on the file.
 */
export interface CreateAttachmentParams {
  file: File;
}

/**
 * `createRestApi` posts JSON. Uploading needs multipart, so attachments bring
 * their own `CrudApi` - which is the case the doc on `createRestApi` is about.
 */
export const crudApi: CrudApi<IAttachment, CreateAttachmentParams> = {
  getAll: () => apiClient.get<IAttachment[]>(ATTACHMENTS_PATH),
  create: ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    // the server still reads these off the form. Sending them empty keeps the
    // existing endpoint happy while the relationship row carries the real link
    formData.append("entity_type", "");
    formData.append("entity_id", "");

    return apiClient.post<IAttachment>(ATTACHMENTS_PATH, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  // TODO: unverified - no caller has ever hit PATCH /attachments/:id. If the
  // server does not have it, renaming will 404 and the optimistic patch rolls
  // forward anyway, since `update` only reconciles when a body comes back
  update: (id, props) =>
    apiClient.patch<IAttachment>(`${ATTACHMENTS_PATH}/${id}`, props),
  delete: (id) => apiClient.delete(`${ATTACHMENTS_PATH}/${id}`),
};

/**
 * Downloading is not CRUD - it returns bytes, not the entity - so it stays off
 * the store and is called directly by whoever renders the file.
 */
export const download = (id: number) =>
  apiClient.get<Blob>(`${ATTACHMENTS_PATH}/${id}/download`, {
    responseType: "blob",
  });

export interface ListParams {
  entity_type?: string;
  entity_id?: string;
}

/**
 * The pre-store surface, still used by `components/Attachments`, which keeps
 * its own `useState` list and filters server side. Delete this once that
 * component reads `useAttachmentsState` instead.
 */
export const api = {
  list: (params?: ListParams) =>
    apiClient.get<IAttachment[]>(ATTACHMENTS_PATH, { params }),
  get: (id: number) => apiClient.get<IAttachment>(`${ATTACHMENTS_PATH}/${id}`),
  upload: (file: File, entity_type: string, entity_id: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entity_type", entity_type);
    formData.append("entity_id", entity_id);
    return apiClient.post<IAttachment>(ATTACHMENTS_PATH, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  download,
  remove: (id: number) => apiClient.delete(`${ATTACHMENTS_PATH}/${id}`),
} as const;
