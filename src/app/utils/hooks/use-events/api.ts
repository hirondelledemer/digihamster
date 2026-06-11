import { Event } from "@/models/event";
import apiClient from "../../api-client";

export type FieldsRequired = Pick<
  Event,
  "title" | "description" | "project_id" | "all_day" | "start_at" | "end_at"
>;

const EVENTS_PATH = "/events";

export const api = {
  getEvents: () => apiClient.get<Event[]>(EVENTS_PATH),
  createEvent: (data: FieldsRequired) =>
    apiClient.post<Event>(EVENTS_PATH, data),
  updateEvent: (eventId: string, props: Partial<Event>) =>
    apiClient.patch(`${EVENTS_PATH}/${eventId}`, props),
  deleteEvent: (eventId: string) =>
    apiClient.delete(`${EVENTS_PATH}/${eventId}`),
} as const;
