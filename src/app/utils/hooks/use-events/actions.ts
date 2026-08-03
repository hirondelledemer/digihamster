import { IEvent } from "../../types/event";

export interface EventsState {
  data: IEvent[];
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
    data: IEvent[];
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
    event: IEvent;
  };
}

export interface UpdateEventAction {
  type: EventsStateActionType.UpdateEvent;
  payload: {
    id: number;
    event: Partial<IEvent>;
  };
}
export interface DeleteEventAction {
  type: EventsStateActionType.DeleteEvent;
  payload: {
    id: number;
  };
}

export type EventsStateAction =
  | EventsLoadAction
  | EventsFinishLoadingAction
  | EventsErrorAction
  | CreateEventAction
  | UpdateEventAction
  | DeleteEventAction;
