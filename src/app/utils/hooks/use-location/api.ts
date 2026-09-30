import apiClient from "../../api-client";
import { ILocation } from "../../types/location";

export type FieldsRequired = Pick<ILocation, "title" | "color">;

export type CreateLocationParams = FieldsRequired;

export const LOCATIONS_PATH = "/locations";

export const getLocationsPath = (id: number) => `${LOCATIONS_PATH}/${id}`;

export const api = {
  getLocations: () => apiClient.get<ILocation[]>(LOCATIONS_PATH),
  createLocation: (data: CreateLocationParams) =>
    apiClient.post<ILocation>(LOCATIONS_PATH, data),
  updateLocation: (id: number, props: Partial<ILocation>) =>
    apiClient.patch(getLocationsPath(id), props),
  deleteLocation: (id: number) => apiClient.delete(getLocationsPath(id)),
} as const;
