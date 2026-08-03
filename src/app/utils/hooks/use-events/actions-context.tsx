import { createContext, useContext } from "react";
import { FieldsRequired } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { IEvent } from "../../types/event";

type EventActionsContextValue = ActionsContextValue<FieldsRequired, IEvent>;

const DEFAULT_EVENTS_ACTIONS: EventActionsContextValue = {
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const EventsActionsContext = createContext<EventActionsContextValue>(
  DEFAULT_EVENTS_ACTIONS,
);

export const useEventsActions = () => useContext(EventsActionsContext);
