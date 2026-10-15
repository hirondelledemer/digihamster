import { createContext, useContext } from "react";
import { CreateTaskParams } from "./api";
import { ITask } from "../../types/task";

export interface TasksActionsContextValue {
  createTask(
    data: CreateTaskParams,
    onDone?: () => void
  ): Promise<ITask | null>;
  updateTask(id: number, data: Partial<ITask>, onDone?: () => void): void;
  deleteTask(id: number, onDone?: () => void): void;
  reorderTasksInTheEvent(eventId: number, taskIds: number[]): void;
  reorderTasksInTheProject(projectId: number, taskIds: number[]): void;
}

const DEFAULT_ACTIONS: TasksActionsContextValue = {
  createTask: async () => null,
  updateTask: () => {},
  deleteTask: () => {},
  reorderTasksInTheEvent: () => {},
  reorderTasksInTheProject: () => {},
};

export const TasksActionsContext =
  createContext<TasksActionsContextValue>(DEFAULT_ACTIONS);

export const useTasksActions = () => useContext(TasksActionsContext);
