import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Event } from "@/models/event";

interface EventActionsContextValue {
  createEvent(event: Pick<Event, FieldsRequired>, onDone?: () => void): void;
  updateEvent(
    eventId: string,
    event: Partial<Event>,
    onDone?: () => void
  ): void;
  deleteEvent(eventId: string, onDone?: () => void): void;
}

const DEFAULT_EVENTS_ACTIONS: EventActionsContextValue = {
  createEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
} as const;

export const EventsActionsContext = createContext<EventActionsContextValue>(
  DEFAULT_EVENTS_ACTIONS
);

export const useEventsActions = () => useContext(EventsActionsContext);
