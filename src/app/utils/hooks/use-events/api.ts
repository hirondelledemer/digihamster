import { IEvent } from "../../types/event";
import { createRestApi } from "../use-crud/api";

export type FieldsRequired = Pick<
  IEvent,
  "title" | "description" | "project_id" | "all_day" | "start_at" | "end_at"
>;

export type CreateEventParams = FieldsRequired;

export const EVENTS_PATH = "/events";

export const getEventsPath = (id: number) => `${EVENTS_PATH}/${id}`;

export const api = createRestApi<IEvent, CreateEventParams>(EVENTS_PATH);
