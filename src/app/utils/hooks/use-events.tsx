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

interface EventsState {
  data: Event[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export const EventsContext = createContext<EventsState>({
  data: [],
  errorMessage: undefined,
  isLoading: false,
});

const { Provider } = EventsContext;

enum EventsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
}

interface EventsLoadAction {
  type: EventsStateActionType.StartLoading;
}
interface EventsFinishLoadingAction {
  type: EventsStateActionType.FinishLoading;
  payload: {
    data: Event[];
  };
}

interface EventsErrorAction {
  type: EventsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}

type EventsStateAction =
  | EventsLoadAction
  | EventsFinishLoadingAction
  | EventsErrorAction;

function reducer(state: EventsState, action: EventsStateAction) {
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

  return <Provider value={state}>{children}</Provider>;
};

export const useEvents = () => useContext(EventsContext);
