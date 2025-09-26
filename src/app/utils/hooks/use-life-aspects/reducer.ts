import {
  LifeAspectsState,
  LifeAspectStateAction,
  LifeAspectStateActionType,
} from "./actions";

export function reducer(
  state: LifeAspectsState,
  action: LifeAspectStateAction
) {
  switch (action.type) {
    case LifeAspectStateActionType.StartLoading: {
      return {
        isLoading: true,
        data: [],
      };
    }
    case LifeAspectStateActionType.FinishLoading: {
      return {
        isLoading: false,
        data: action.payload.data,
      };
    }
    case LifeAspectStateActionType.Error: {
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
