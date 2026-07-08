import { JournalEntry } from "@/models/entry";
import { updateObjById } from "../../common/update-array";
import {
  EntriesState,
  EntriesStateAction,
  EntriesStateActionType,
} from "./actions";

export function reducer(state: EntriesState, action: EntriesStateAction) {
  switch (action.type) {
    case EntriesStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case EntriesStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case EntriesStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case EntriesStateActionType.CreateEntry: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.entry],
      };
    }
    case EntriesStateActionType.UpdateEntry: {
      return {
        isLoading: false,
        data: updateObjById<JournalEntry>(
          state.data,
          action.payload.id,
          action.payload.entry
        ),
      };
    }
    case EntriesStateActionType.DeleteEntry: {
      return {
        isLoading: false,
        data: state.data.filter((entry) => entry._id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
