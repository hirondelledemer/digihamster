import { updateObjById } from "../../common/update-array";
import { CrudAction, CrudActionType, CrudState } from "./actions";

export function crudReducer<Entity extends { id: number }>(
  state: CrudState<Entity>,
  action: CrudAction<Entity>
): CrudState<Entity> {
  switch (action.type) {
    case CrudActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case CrudActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case CrudActionType.Error: {
      return {
        isLoading: false,
        data: [],
        errorMessage: action.payload.errorMessage,
      };
    }
    case CrudActionType.Create: {
      return {
        isLoading: true,
        data: [...state.data, action.payload.entity],
      };
    }
    case CrudActionType.Update: {
      return {
        isLoading: false,
        data: updateObjById<Entity>(
          state.data,
          action.payload.id,
          action.payload.entity
        ),
      };
    }
    case CrudActionType.Delete: {
      return {
        isLoading: false,
        data: state.data.filter((entity) => entity.id !== action.payload.id),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
