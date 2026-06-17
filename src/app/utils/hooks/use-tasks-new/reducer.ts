import { TasksNewState, TasksNewAction, TasksNewActionType } from "./actions";

export function reducer(
  state: TasksNewState,
  action: TasksNewAction,
): TasksNewState {
  switch (action.type) {
    case TasksNewActionType.StartLoading:
      return { ...state, isLoading: true };
    case TasksNewActionType.FinishLoading:
      return { ...state, isLoading: false, data: action.payload.data };
    case TasksNewActionType.Error:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.errorMessage,
      };
    case TasksNewActionType.CreateTask:
      return { ...state, data: [...state.data, action.payload.task] };
    case TasksNewActionType.UpdateTask:
      return {
        ...state,
        data: state.data.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.task } : t,
        ),
      };
    case TasksNewActionType.DeleteTask:
      return {
        ...state,
        data: state.data.filter((t) => t.id !== action.payload.id),
      };
    default:
      throw new Error("Unknown action");
  }
}
