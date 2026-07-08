import { Tag } from "@/models/tag";
import { updateObjById } from "../../common/update-array";
import { TagsState, TagsStateAction, TagsStateActionType } from "./actions";

export function reducer(state: TagsState, action: TagsStateAction) {
  switch (action.type) {
    case TagsStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case TagsStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case TagsStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case TagsStateActionType.CreateTag: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.tag],
      };
    }
    case TagsStateActionType.UpdateTag: {
      return {
        isLoading: false,
        data: updateObjById<Tag>(
          state.data,
          action.payload.id,
          action.payload.tag
        ),
      };
    }
    case TagsStateActionType.DeleteTag: {
      return {
        isLoading: false,
        data: state.data.filter((tag) => tag._id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
