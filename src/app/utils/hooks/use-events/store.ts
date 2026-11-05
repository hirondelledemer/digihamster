import { EventStatus, IEvent } from "../../types/event";
import { now } from "../../date/now";
import { toBackendDateTime } from "#utils/date";
import { createCrudStore } from "../use-crud/create-crud-store";
import { api, CreateEventParams } from "./api";

export const eventsStore = createCrudStore<IEvent, CreateEventParams>({
  entityName: "Event",
  api,
  // an event you have only just drawn is pending and was created now. The
  // server says the same thing a moment later, but until it answers these
  // are what the status gate on the Complete button and the created_at
  // column read
  toOptimistic: (data, tempId) => ({
    id: tempId,
    created_at: toBackendDateTime(now()),
    status: EventStatus.Pending,
    ...data,
  }),
});
