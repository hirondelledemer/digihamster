import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { Event } from "@/models/event";
import { ActionsContextValue } from "../use-crud/actions-context";

type EventActionsContextValue = ActionsContextValue<FieldsRequired, Event>;

const DEFAULT_EVENTS_ACTIONS: EventActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
} as const;

export const EventsActionsContext = createContext<EventActionsContextValue>(
  DEFAULT_EVENTS_ACTIONS
);

export const useEventsActions = () => useContext(EventsActionsContext);
