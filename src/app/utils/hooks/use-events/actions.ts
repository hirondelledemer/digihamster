import { Event } from "@/models/event";

export interface EventsState {
  data: Event[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum EventsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateEvent = "CREATE_EVENT",
  UpdateEvent = "UPDATE_EVENT",
  DeleteEvent = "DELETE_EVENT",
}

export interface EventsLoadAction {
  type: EventsStateActionType.StartLoading;
}
export interface EventsFinishLoadingAction {
  type: EventsStateActionType.FinishLoading;
  payload: {
    data: Event[];
  };
}

export interface EventsErrorAction {
  type: EventsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateEventAction {
  type: EventsStateActionType.CreateEvent;
  payload: {
    event: Event;
  };
}

export interface UpdateEventAction {
  type: EventsStateActionType.UpdateEvent;
  payload: {
    id: string;
    event: Partial<Event>;
  };
}
export interface DeleteEventAction {
  type: EventsStateActionType.DeleteEvent;
  payload: {
    id: string;
  };
}

export type EventsStateAction =
  | EventsLoadAction
  | EventsFinishLoadingAction
  | EventsErrorAction
  | CreateEventAction
  | UpdateEventAction
  | DeleteEventAction;
