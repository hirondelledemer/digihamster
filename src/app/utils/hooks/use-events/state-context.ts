import { createContext, useContext } from "react";
import { EventsState } from "./actions";

type EventContextValue = EventsState;

const DEFAULT_EVENTS_STATE: EventsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const EventsStateContext =
  createContext<EventContextValue>(DEFAULT_EVENTS_STATE);

export const useEventsState = () => useContext(EventsStateContext);
