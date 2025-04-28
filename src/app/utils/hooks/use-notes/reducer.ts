import { Note } from "@/models/note";
import { updateObjById } from "../../common/update-array";
import { NotesState, NotesStateAction, NotesStateActionType } from "./actions";

export function reducer(state: NotesState, action: NotesStateAction) {
  switch (action.type) {
    case NotesStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case NotesStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case NotesStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case NotesStateActionType.CreateNote: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.note],
      };
    }
    case NotesStateActionType.UpdateNote: {
      return {
        isLoading: false,
        data: updateObjById<Note>(
          state.data,
          action.payload.id,
          action.payload.note
        ),
      };
    }
    case NotesStateActionType.DeleteNote: {
      return {
        isLoading: false,
        data: state.data.filter((note) => note._id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
