import { TasksState, TasksAction, TasksActionType } from "./actions";

export function reducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case TasksActionType.StartLoading:
      return { ...state, isLoading: true };
    case TasksActionType.FinishLoading:
      return { ...state, isLoading: false, data: action.payload.data };
    case TasksActionType.Error:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.errorMessage,
      };
    case TasksActionType.CreateTask:
      return { ...state, data: [...state.data, action.payload.task] };
    case TasksActionType.UpdateTask:
      return {
        ...state,
        data: state.data.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.task } : t
        ),
      };
    case TasksActionType.DeleteTask:
      return {
        ...state,
        data: state.data.filter((t) => t.id !== action.payload.id),
      };
    default:
      throw new Error("Unknown action");
  }
}
