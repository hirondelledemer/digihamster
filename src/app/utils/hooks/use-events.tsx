"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import axios from "axios";
import { Event } from "@/models/event";
import { useToast } from "@/app/components/ui/use-toast";
import { updateObjById } from "../common/update-array";

interface EventsState {
  data: Event[];
  isLoading: boolean;
  errorMessage?: unknown;
}

interface EventContextValue extends EventsState {
  createEvent(event: Pick<Event, FieldsRequired>, onDone?: () => void): void;
  updateEvent(
    eventId: string,
    event: Partial<Event>,
    onDone?: () => void
  ): void;
}

export const EventsContext = createContext<EventContextValue>({
  data: [],
  errorMessage: undefined,
  isLoading: false,
  createEvent: () => {},
  updateEvent: () => {},
});

const { Provider } = EventsContext;

export enum EventsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateEvent = "CREATE_EVENT",
  UpdateEvent = "UPDATE_EVENT",
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

type EventsStateAction =
  | EventsLoadAction
  | EventsFinishLoadingAction
  | EventsErrorAction
  | CreateEventAction
  | UpdateEventAction;

export type FieldsRequired =
  | "title"
  | "description"
  | "projectId"
  | "allDay"
  | "startAt"
  | "endAt";

export function reducer(state: EventsState, action: EventsStateAction) {
  switch (action.type) {
    case EventsStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case EventsStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case EventsStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case EventsStateActionType.CreateEvent: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.event],
      };
    }
    case EventsStateActionType.UpdateEvent: {
      return {
        isLoading: false,
        data: updateObjById<Event>(
          state.data,
          action.payload.id,
          action.payload.event
        ),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}

export const EventsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        dispatch({ type: EventsStateActionType.StartLoading });
        const eventsResponse = await axios.get<Event[]>("/api/events");
        dispatch({
          type: EventsStateActionType.FinishLoading,
          payload: {
            data: eventsResponse.data,
          },
        });
      } catch (err) {
        dispatch({
          type: EventsStateActionType.Error,
          payload: { errorMessage: err },
        });
        toast({
          title: "Error",
          description: "error while getting events",
          variant: "destructive",
        });
      }
    })();
  }, [toast]);

  const createEvent = async (
    data: Pick<Event, FieldsRequired>,
    onDone?: () => void
  ) => {
    const tempId = "temp-id";

    const tempEvent: Event = {
      _id: tempId,
      completed: false,
      deleted: false,
      createdAt: "",
      updatedAt: "",
      tags: [],
      ...data,
    };
    dispatch({
      type: EventsStateActionType.CreateEvent,
      payload: { event: tempEvent },
    });

    if (onDone) {
      onDone();
    }

    try {
      const response = await axios.post<Event>("/api/events", data);

      dispatch({
        type: EventsStateActionType.UpdateEvent,
        payload: {
          id: tempId,
          event: response.data,
        },
      });

      toast({
        title: "Success",
        description: "Event has been created",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const updateEvent = async (
    eventId: string,
    props: Partial<Event>,
    onDone?: () => void
  ) => {
    try {
      dispatch({
        type: EventsStateActionType.UpdateEvent,
        payload: {
          id: eventId,
          event: props,
        },
      });
      if (onDone) {
        onDone();
      }
      await axios.patch("/api/events", {
        eventId,
        ...props,
      });
      toast({
        title: "Success",
        description: "Event has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  return (
    <Provider value={{ ...state, createEvent, updateEvent }}>
      {children}
    </Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
