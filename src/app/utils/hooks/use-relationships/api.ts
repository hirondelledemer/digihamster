import apiClient from "../../api-client";
import { IRelationship } from "../../types/relationship";

export type FieldsRequired = Pick<
  IRelationship,
  "source_type" | "source_id" | "target_id" | "target_type"
>;

export const RELATIONSHIPS_PATH = "/relationships";

export const api = {
  create: (data: FieldsRequired) =>
    apiClient.post<IRelationship>(RELATIONSHIPS_PATH, data),
} as const;
