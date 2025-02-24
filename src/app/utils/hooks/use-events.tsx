"use client";

import {
  ReactNode,
  createContext,
  useCallback,
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

type EventContextValue = EventsState;

interface EventActionsContextValue {
  createEvent(event: Pick<Event, FieldsRequired>, onDone?: () => void): void;
  updateEvent(
    eventId: string,
    event: Partial<Event>,
    onDone?: () => void
  ): void;
  deleteEvent(eventId: string, onDone?: () => void): void;
}

const DEFAULT_EVENTS_STATE: EventsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const EventsStateContext =
  createContext<EventContextValue>(DEFAULT_EVENTS_STATE);

const DEFAULT_EVENTS_ACTIONS: EventActionsContextValue = {
  createEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
} as const;

export const EventsActionsContext = createContext<EventActionsContextValue>(
  DEFAULT_EVENTS_ACTIONS
);

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

type EventsStateAction =
  | EventsLoadAction
  | EventsFinishLoadingAction
  | EventsErrorAction
  | CreateEventAction
  | UpdateEventAction
  | DeleteEventAction;

const api = {
  getEvents: () => axios.get<Event[]>("/api/events"),
  createEvent: (data: Pick<Event, FieldsRequired>) =>
    axios.post<Event>("/api/events", data),
  updateEvent: (eventId: string, props: Partial<Event>) =>
    axios.patch("/api/events", { eventId, ...props }),
  deleteEvent: (eventId: string) =>
    axios.patch("/api/events", { eventId, deleted: true }),
};

export type FieldsRequired = keyof Pick<
  Event,
  "title" | "description" | "projectId" | "allDay" | "startAt" | "endAt"
>;

const handleApiError = (
  error: any,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

const handleSuccessToast = (
  toast: ReturnType<typeof useToast>["toast"],
  message: string
) => {
  toast({
    title: "Success",
    description: message,
  });
};

const fetchEvents = async (
  dispatch: React.Dispatch<EventsStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: EventsStateActionType.StartLoading });
    const eventsResponse = await api.getEvents();
    console.log("AAAA fething", eventsResponse);
    dispatch({
      type: EventsStateActionType.FinishLoading,
      payload: { data: eventsResponse.data },
    });
  } catch (err) {
    dispatch({
      type: EventsStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

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
    case EventsStateActionType.DeleteEvent: {
      return {
        isLoading: false,
        data: state.data.filter((event) => event._id !== action.payload.id),
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

  const fetchEventsMemoized = useCallback(() => {
    fetchEvents(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchEventsMemoized();
  }, [fetchEventsMemoized]);

  const createEvent = useCallback(
    async (data: Pick<Event, FieldsRequired>, onDone?: () => void) => {
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
        const response = await api.createEvent(data);

        dispatch({
          type: EventsStateActionType.UpdateEvent,
          payload: {
            id: tempId,
            event: response.data,
          },
        });

        handleSuccessToast(toast, "Event has been created");
      } catch (e: any) {
        // todo: fix
        dispatch({
          type: EventsStateActionType.DeleteEvent,
          payload: {
            id: tempId,
          },
        });
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const updateEvent = useCallback(
    async (eventId: string, props: Partial<Event>, onDone?: () => void) => {
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

        await api.updateEvent(eventId, props);

        handleSuccessToast(toast, "Event has been updated");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const deleteEvent = useCallback(
    async (eventId: string, onDone?: () => void) => {
      try {
        dispatch({
          type: EventsStateActionType.DeleteEvent,
          payload: {
            id: eventId,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteEvent(eventId);

        handleSuccessToast(toast, "Event has been deleted");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  return (
    <EventsStateContext.Provider value={state}>
      <EventsActionsContext.Provider
        value={{ createEvent, updateEvent, deleteEvent }}
      >
        {children}
      </EventsActionsContext.Provider>
    </EventsStateContext.Provider>
  );
};

export const useEventsState = () => useContext(EventsStateContext);
export const useEventsActions = () => useContext(EventsActionsContext);
