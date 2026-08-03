import apiClient from "../../api-client";
import { IEvent } from "../../types/event";

export type FieldsRequired = Pick<
  IEvent,
  "title" | "description" | "project_id" | "all_day" | "start_at" | "end_at"
>;

export const EVENTS_PATH = "/events";

export const getEventsPath = (id: number) => `${EVENTS_PATH}/${id}`;

export const api = {
  getEvents: () => apiClient.get<IEvent[]>(EVENTS_PATH),
  createEvent: (data: FieldsRequired) =>
    apiClient.post<IEvent>(EVENTS_PATH, data),
  updateEvent: (eventId: number, props: Partial<IEvent>) =>
    apiClient.patch(getEventsPath(eventId), props),
  deleteEvent: (eventId: number) => apiClient.delete(getEventsPath(eventId)),
} as const;
