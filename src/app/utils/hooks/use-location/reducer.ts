import { updateObjById } from "../../common/update-array";
import { ILocation } from "../../types/location";
import {
  LocationsState,
  LocationsStateAction,
  LocationsStateActionType,
} from "./actions";

export function reducer(state: LocationsState, action: LocationsStateAction) {
  switch (action.type) {
    case LocationsStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case LocationsStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case LocationsStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case LocationsStateActionType.CreateLocation: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.location],
      };
    }
    case LocationsStateActionType.UpdateLocation: {
      return {
        isLoading: false,
        data: updateObjById<ILocation>(
          state.data,
          action.payload.id,
          action.payload.location
        ),
      };
    }
    case LocationsStateActionType.DeleteLocation: {
      return {
        isLoading: false,
        data: state.data.filter(
          (location) => location.id !== action.payload.id
        ),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
