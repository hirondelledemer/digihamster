import { createContext, useContext } from "react";
import { CreateTaskParams } from "./api";
import { TaskV2 } from "@/models/taskV2";

export interface TasksNewActionsContextValue {
  createTask(data: CreateTaskParams, onDone?: () => void): void;
  updateTask(id: string, data: Partial<TaskV2>, onDone?: () => void): void;
  deleteTask(id: string, onDone?: () => void): void;
}

const DEFAULT_ACTIONS: TasksNewActionsContextValue = {
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
};

export const TasksNewActionsContext =
  createContext<TasksNewActionsContextValue>(DEFAULT_ACTIONS);

export const useTasksNewActions = () => useContext(TasksNewActionsContext);
