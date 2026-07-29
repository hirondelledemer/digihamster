"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { reducer } from "./reducer";
import { TasksNewAction, TasksNewActionType } from "./actions";
import { api, CreateTaskParams } from "./api";
import { TasksNewStateContext } from "./state-context";
import { TasksNewActionsContext } from "./actions-context";
import { ITask, TaskStatus } from "../../types/task";
import { now } from "../../date/now";

const handleApiError = (
  error: any,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  toast({ title: "Error", description: errorMessage, variant: "destructive" });
};

const fetchTasks = async (
  dispatch: React.Dispatch<TasksNewAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: TasksNewActionType.StartLoading });
    const response = await api.getTasks();
    dispatch({
      type: TasksNewActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: TasksNewActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const TasksNewContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  const fetchDataMemoized = useCallback(() => {
    fetchTasks(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createTask = useCallback(
    async (data: CreateTaskParams, onDone?: () => void) => {
      const nowDate = now().valueOf();
      const tempId = -nowDate;
      const tempTask: ITask = {
        id: tempId,
        title: data.title,
        project_id: data.project_id || null,
        event_id: null,
        description: null,
        status: TaskStatus.Todo,
        deadline: null,
        activated_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
      };

      dispatch({
        type: TasksNewActionType.CreateTask,
        payload: { task: tempTask },
      });
      if (onDone) onDone();

      try {
        const response = await api.createTask(data);
        dispatch({
          type: TasksNewActionType.UpdateTask,
          payload: { id: tempId, task: response.data },
        });
        toast({ title: "Success", description: "Task has been created" });
      } catch (e: any) {
        dispatch({
          type: TasksNewActionType.DeleteTask,
          payload: { id: tempId },
        });
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const updateTask = useCallback(
    async (id: number, data: Partial<ITask>, onDone?: () => void) => {
      dispatch({
        type: TasksNewActionType.UpdateTask,
        payload: { id, task: data },
      });
      if (onDone) onDone();
      try {
        await api.updateTask(id, data);
        toast({ title: "Success", description: "Task has been updated" });
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deleteTask = useCallback(
    async (id: number, onDone?: () => void) => {
      dispatch({ type: TasksNewActionType.DeleteTask, payload: { id } });
      if (onDone) onDone();
      try {
        await api.deleteTask(id);
        toast({ title: "Success", description: "Task has been deleted" });
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  return (
    <TasksNewStateContext.Provider value={state}>
      <TasksNewActionsContext.Provider
        value={{ createTask, updateTask, deleteTask }}
      >
        {children}
      </TasksNewActionsContext.Provider>
    </TasksNewStateContext.Provider>
  );
};
