import axios from "axios";
import { Event } from "@/models/event";

export type FieldsRequired = keyof Pick<
  Event,
  "title" | "description" | "projectId" | "allDay" | "startAt" | "endAt"
>;

export const api = {
  getEvents: () => axios.get<Event[]>("/api/events"),
  createEvent: (data: Pick<Event, FieldsRequired>) =>
    axios.post<Event>("/api/events", data),
  updateEvent: (eventId: string, props: Partial<Event>) =>
    axios.patch("/api/events", { eventId, ...props }),
  deleteEvent: (eventId: string) =>
    axios.patch("/api/events", { eventId, deleted: true }),
} as const;
