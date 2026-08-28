import { updateObjById } from "../../common/update-array";
import { IRelationship } from "../../types/relationship";
import {
  RelationshipsState,
  RelationshipsStateAction,
  RelationshipsStateActionType,
} from "./actions";

export function reducer(
  state: RelationshipsState,
  action: RelationshipsStateAction,
) {
  switch (action.type) {
    case RelationshipsStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case RelationshipsStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case RelationshipsStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case RelationshipsStateActionType.CreateRelationship: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.relationship],
      };
    }
    case RelationshipsStateActionType.UpdateRelationship: {
      return {
        isLoading: false,
        data: updateObjById<IRelationship>(
          state.data,
          action.payload.id,
          action.payload.relationship,
        ),
      };
    }
    case RelationshipsStateActionType.DeleteRelationship: {
      return {
        isLoading: false,
        data: state.data.filter(
          (relationship) => relationship.id !== action.payload.id,
        ),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
