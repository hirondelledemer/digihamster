import apiClient from "../../api-client";
import { IEvent } from "../../types/event";

export type FieldsRequired = Pick<
  IEvent,
  "title" | "description" | "project_id" | "all_day" | "start_at" | "end_at"
>;

const EVENTS_PATH = "/events";

export const api = {
  getEvents: () => apiClient.get<IEvent[]>(EVENTS_PATH),
  createEvent: (data: FieldsRequired) =>
    apiClient.post<IEvent>(EVENTS_PATH, data),
  updateEvent: (eventId: number, props: Partial<IEvent>) =>
    apiClient.patch(`${EVENTS_PATH}/${eventId}`, props),
  deleteEvent: (eventId: number) =>
    apiClient.delete(`${EVENTS_PATH}/${eventId}`),
} as const;
