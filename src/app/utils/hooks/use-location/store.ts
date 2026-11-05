import { createCrudStore } from "../use-crud/create-crud-store";
import { ILocation } from "../../types/location";
import { api, CreateLocationParams } from "./api";

export const locationsStore = createCrudStore<ILocation, CreateLocationParams>({
  entityName: "Location",
  api,
  // a location is its create params plus an id - the address fields are
  // optional and nothing is derived server side
  toOptimistic: (data, tempId) => ({ id: tempId, ...data }),
});
