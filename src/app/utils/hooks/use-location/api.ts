import { createRestApi } from "../use-crud/api";
import { ILocation } from "../../types/location";

export type FieldsRequired = Pick<ILocation, "title" | "color">;

export type CreateLocationParams = FieldsRequired;

export const LOCATIONS_PATH = "/locations";

export const api = createRestApi<ILocation, CreateLocationParams>(
  LOCATIONS_PATH
);
