import apiClient from "../../api-client";
import { IPerson } from "../../types/person";

export type FieldsRequired = Pick<IPerson, "name" | "color">;

export type CreatePersonParams = FieldsRequired;

export const PEOPLE_PATH = "/people";

export const getPeoplePath = (id: number) => `${PEOPLE_PATH}/${id}`;

export const api = {
  getPeople: () => apiClient.get<IPerson[]>(PEOPLE_PATH),
  createPerson: (data: CreatePersonParams) =>
    apiClient.post<IPerson>(PEOPLE_PATH, data),
  updatePerson: (id: number, props: Partial<IPerson>) =>
    apiClient.patch(getPeoplePath(id), props),
  deletePerson: (id: number) => apiClient.delete(getPeoplePath(id)),
} as const;
