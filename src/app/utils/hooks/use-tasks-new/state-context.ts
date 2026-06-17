import { createContext, useContext } from "react";
import { TasksNewState } from "./actions";

const DEFAULT_STATE: TasksNewState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
};

export const TasksNewStateContext =
  createContext<TasksNewState>(DEFAULT_STATE);

export const useTasksNewState = () => useContext(TasksNewStateContext);
