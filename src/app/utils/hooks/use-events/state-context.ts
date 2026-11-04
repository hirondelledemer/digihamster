import { eventsStore } from "./store";

export const EventsStateContext = eventsStore.StateContext;

export const useEventsState = eventsStore.useEntityState;
