import apiClient from "../../api-client";
import { IRelationship } from "../../types/relationship";

export type FieldsRequired = Pick<
  IRelationship,
  "source_type" | "source_id" | "target_id" | "target_type"
>;

export type CreateRelationshipParams = FieldsRequired;

export const RELATIONSHIPS_PATH = "/relationships";

export const getRelationshipsPath = (id: number) =>
  `${RELATIONSHIPS_PATH}/${id}`;

export const api = {
  getRelationships: () => apiClient.get<IRelationship[]>(RELATIONSHIPS_PATH),
  createRelationship: (data: CreateRelationshipParams) =>
    apiClient.post<IRelationship>(RELATIONSHIPS_PATH, data),
  updateRelationship: (id: number, props: Partial<IRelationship>) =>
    apiClient.patch(getRelationshipsPath(id), props),
  deleteRelationship: (id: number) =>
    apiClient.delete(getRelationshipsPath(id)),
} as const;
