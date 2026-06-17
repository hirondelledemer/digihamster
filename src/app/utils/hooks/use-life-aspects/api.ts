import apiClient from "@/app/utils/api-client";
import { LifeAspect, LifeAspectAsset } from "@/models/life-aspect.js";

export type LifeAspectFields = {
  title: string;
  description?: string;
  asset: LifeAspectAsset;
};

export const api = {
  getLifeAspects: () =>
    apiClient.get<LifeAspect[]>("/life-aspects/with-boosts"),
  createLifeAspect: (data: LifeAspectFields) =>
    apiClient.post<LifeAspect>("/life-aspects", data),
  updateLifeAspect: (id: string, data: Partial<LifeAspectFields>) =>
    apiClient.patch<LifeAspect>(`/life-aspects/${id}`, data),
  deleteLifeAspect: (id: string) => apiClient.delete(`/life-aspects/${id}`),
} as const;
