import { updateObjById } from "../../common/update-array";
import {
  EventsState,
  EventsStateAction,
  EventsStateActionType,
} from "./actions";
import { Event } from "@/models/event";

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
