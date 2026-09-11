import { updateObjById } from "../../common/update-array";
import { IPerson } from "../../types/person";
import {
  PeopleState,
  PeopleStateAction,
  PeopleStateActionType,
} from "./actions";

export function reducer(state: PeopleState, action: PeopleStateAction) {
  switch (action.type) {
    case PeopleStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case PeopleStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case PeopleStateActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case PeopleStateActionType.CreatePerson: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.person],
      };
    }
    case PeopleStateActionType.UpdatePerson: {
      return {
        isLoading: false,
        data: updateObjById<IPerson>(
          state.data,
          action.payload.id,
          action.payload.person,
        ),
      };
    }
    case PeopleStateActionType.DeletePerson: {
      return {
        isLoading: false,
        data: state.data.filter((person) => person.id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
