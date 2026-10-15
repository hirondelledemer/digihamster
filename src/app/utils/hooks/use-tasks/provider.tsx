"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { reducer } from "./reducer";
import { TasksAction, TasksActionType } from "./actions";
import { api, CreateTaskParams } from "./api";
import { TasksStateContext } from "./state-context";
import { TasksActionsContext } from "./actions-context";
import { ITask, TaskStatus } from "../../types/task";
import { now } from "../../date/now";
import { toBackendDateTime } from "#utils/date";
import { getApiErrorMessage } from "../../axios";

const handleApiError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
    variant: "destructive",
  });
};

const fetchTasks = async (
  dispatch: React.Dispatch<TasksAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: TasksActionType.StartLoading });
    const response = await api.getTasks();
    dispatch({
      type: TasksActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: TasksActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const TasksContextProvider = ({ children }: { children: ReactNode }) => {
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
      const nowDate = now();
      const tempId = -nowDate.valueOf();
      const tempTask: ITask = {
        id: tempId,
        title: data.title,
        project_id: data.project_id || null,
        event_id: null,
        project_sort_order: null,
        event_sort_order: null,
        description: null,
        status: TaskStatus.Todo,
        deadline: null,
        activated_at: null,
        completed_at: null,
        created_at: toBackendDateTime(nowDate),
      };

      dispatch({
        type: TasksActionType.CreateTask,
        payload: { task: tempTask },
      });

      if (onDone) onDone();

      try {
        const response = await api.createTask(data);
        dispatch({
          type: TasksActionType.UpdateTask,
          payload: { id: tempId, task: response.data },
        });
        toast({ title: "Success", description: "Task has been created" });

        return response.data;
      } catch (e: any) {
        dispatch({
          type: TasksActionType.DeleteTask,
          payload: { id: tempId },
        });
        handleApiError(e, toast);
        return null;
      }
    },
    [toast]
  );

  const updateTask = useCallback(
    async (id: number, data: Partial<ITask>, onDone?: () => void) => {
      dispatch({
        type: TasksActionType.UpdateTask,
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
    [toast]
  );

  const reorderTasksInTheEvent = useCallback(
    async (eventId: number, sortedTaskIds: number[]) => {
      sortedTaskIds.forEach((id, index) => {
        dispatch({
          type: TasksActionType.UpdateTask,
          payload: { id, task: { event_sort_order: index + 1 } },
        });
      });
      try {
        await api.reorderTasksInTheEvent(eventId, sortedTaskIds);
        toast({
          title: "Success",
          description: "Tasks have been reordered successfully",
        });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const reorderTasksInTheProject = useCallback(
    async (projectId: number, sortedTaskIds: number[]) => {
      sortedTaskIds.forEach((id, index) => {
        dispatch({
          type: TasksActionType.UpdateTask,
          payload: { id, task: { project_sort_order: index + 1 } },
        });
      });
      try {
        await api.reorderTasksInTheProject(projectId, sortedTaskIds);
        toast({
          title: "Success",
          description: "Tasks have been reordered successfully",
        });
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const deleteTask = useCallback(
    async (id: number, onDone?: () => void) => {
      dispatch({ type: TasksActionType.DeleteTask, payload: { id } });
      if (onDone) onDone();
      try {
        await api.deleteTask(id);
        toast({ title: "Success", description: "Task has been deleted" });
      } catch (e: any) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  return (
    <TasksStateContext.Provider value={state}>
      <TasksActionsContext.Provider
        value={{
          createTask,
          updateTask,
          deleteTask,
          reorderTasksInTheEvent,
          reorderTasksInTheProject,
        }}
      >
        {children}
      </TasksActionsContext.Provider>
    </TasksStateContext.Provider>
  );
};
