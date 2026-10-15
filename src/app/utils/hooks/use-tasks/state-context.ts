import { createContext, useContext } from "react";
import { TasksState } from "./actions";

const DEFAULT_STATE: TasksState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
};

export const TasksStateContext = createContext<TasksState>(DEFAULT_STATE);

export const useTasksState = () => useContext(TasksStateContext);
