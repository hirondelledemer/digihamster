import { createCrudStore } from "../use-crud/create-crud-store";
import { ILocation } from "../../types/location";
import { api, CreateLocationParams } from "./api";

export const locationsStore = createCrudStore<ILocation, CreateLocationParams>({
  entityName: "Location",
  api,
});
