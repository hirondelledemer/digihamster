import { IEvent } from "../../types/event";
import { createCrudStore } from "../use-crud/create-crud-store";
import { api, CreateEventParams } from "./api";

export const eventsStore = createCrudStore<IEvent, CreateEventParams>({
  entityName: "Event",
  api,
});
