import { updateObjById } from "../../common/update-array";
import { IEvent } from "../../types/event";
import {
  EventsState,
  EventsStateAction,
  EventsStateActionType,
} from "./actions";

export function reducer(state: EventsState, action: EventsStateAction) {
  switch (action.type) {
    case EventsStateActionType.StartLoading: {
      // the events already in state stay put. Wiping them means every consumer
      // flashes an empty list for the length of the refetch
      return {
        ...state,
        isLoading: true,
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
      // the event is added optimistically, so there is nothing to wait for —
      // saying "loading" here makes consumers hide data that is already usable
      return {
        isLoading: false,
        data: [...state.data, action.payload.event],
      };
    }
    case EventsStateActionType.UpdateEvent: {
      return {
        isLoading: false,
        data: updateObjById<IEvent>(
          state.data,
          action.payload.id,
          action.payload.event,
        ),
      };
    }
    case EventsStateActionType.DeleteEvent: {
      return {
        isLoading: false,
        data: state.data.filter((event) => event.id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
