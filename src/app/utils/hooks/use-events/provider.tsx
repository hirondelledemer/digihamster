"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { Event } from "@/models/event";

import { EventsStateAction, EventsStateActionType } from "./actions";
import { api, FieldsRequired } from "./api";
import { EventsStateContext } from "./state-context";
import { EventsActionsContext } from "./actions-context";

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
    async (data: FieldsRequired, onDone?: () => void) => {
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
        value={{
          create: createEvent,
          update: updateEvent,
          delete: deleteEvent,
        }}
      >
        {children}
      </EventsActionsContext.Provider>
    </EventsStateContext.Provider>
  );
};
