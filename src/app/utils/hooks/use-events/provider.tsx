"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { EventsStateAction, EventsStateActionType } from "./actions";
import { api, FieldsRequired } from "./api";
import { EventsStateContext } from "./state-context";
import { EventsActionsContext } from "./actions-context";
import { EventStatus, IEvent } from "../../types/event";
import { now } from "../../date/now";
import { toBackendDateTime } from "#utils/date";
import { getApiErrorMessage } from "../../axios";

const handleApiError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
    variant: "destructive",
  });
};

const handleSuccessToast = (
  toast: ReturnType<typeof useToast>["toast"],
  message: string,
) => {
  toast({
    title: "Success",
    description: message,
  });
};

const fetchEvents = async (
  dispatch: React.Dispatch<EventsStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: EventsStateActionType.StartLoading });
    const eventsResponse = await api.getEvents();

    dispatch({
      type: EventsStateActionType.FinishLoading,
      payload: { data: eventsResponse.data || [] },
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
      const nowDate = now();
      const tempId = -nowDate.valueOf();

      const tempEvent: IEvent = {
        id: tempId,
        status: EventStatus.Pending,
        created_at: toBackendDateTime(nowDate),
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
        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: EventsStateActionType.DeleteEvent,
          payload: {
            id: tempId,
          },
        });

        handleApiError(e, toast);
        return null;
      }
    },
    [toast],
  );

  const updateEvent = useCallback(
    async (eventId: number, props: Partial<IEvent>, onDone?: () => void) => {
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
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deleteEvent = useCallback(
    async (eventId: number, onDone?: () => void) => {
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
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
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
