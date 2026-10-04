import type { AxiosResponse } from "axios";
import apiClient from "../../api-client";

export interface CrudApi<Entity, CreateParams> {
  getAll(): Promise<AxiosResponse<Entity[]>>;
  create(data: CreateParams): Promise<AxiosResponse<Entity>>;
  update(id: number, props: Partial<Entity>): Promise<AxiosResponse<unknown>>;
  delete(id: number): Promise<AxiosResponse<unknown>>;
}

/**
 * Covers entities exposed as plain REST collections (`/locations`,
 * `/locations/:id`). Anything that deviates passes its own `CrudApi` instead.
 */
export const createRestApi = <Entity, CreateParams>(
  path: string
): CrudApi<Entity, CreateParams> => ({
  getAll: () => apiClient.get<Entity[]>(path),
  create: (data) => apiClient.post<Entity>(path, data),
  update: (id, props) => apiClient.patch(`${path}/${id}`, props),
  delete: (id) => apiClient.delete(`${path}/${id}`),
});
