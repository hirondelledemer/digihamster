import { createContext, useContext } from "react";
import { CreateTaskParams } from "./api";
import { ITask } from "../../types/task";

export interface TasksNewActionsContextValue {
  createTask(data: CreateTaskParams, onDone?: () => void): void;
  updateTask(id: number, data: Partial<ITask>, onDone?: () => void): void;
  deleteTask(id: number, onDone?: () => void): void;
}

const DEFAULT_ACTIONS: TasksNewActionsContextValue = {
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
};

export const TasksNewActionsContext =
  createContext<TasksNewActionsContextValue>(DEFAULT_ACTIONS);

export const useTasksNewActions = () => useContext(TasksNewActionsContext);
