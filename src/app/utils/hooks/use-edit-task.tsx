import useTasks from "./use-tasks";
import { updateObjById } from "../common/update-array";
import { useToast } from "@/app/components/ui/use-toast";
import { now } from "../date/date";
import { TaskWithRelations } from "../types/task";
import apiClient from "../api-client";

export type FieldsRequired =
  | "title"
  | "description"
  | "project_id"
  | "status"
  | "deadline";

export const useEditTask = () => {
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

  const createNewTask = async (
    data: Pick<TaskWithRelations, FieldsRequired>,
  ) => {
    const tempId = "temp-id";

    const tempTask: TaskWithRelations = {
      id: tempId,
      event_id: null,
      activated_at: null,
      completed_at: null,
      created_at: now().toString(),
      ...data,
    };
    setTasksData((e) => [...e, tempTask]);

    try {
      await apiClient.post<TaskWithRelations>("/tasks", data);

      const response = await apiClient.get<TaskWithRelations[]>("/tasks");

      setTasksData(response.data);
      toast({
        title: "Success",
        description: "Task has been created",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const editTask = async (
    taskId: string,
    props: Partial<TaskWithRelations>,
    onDone?: () => void,
  ) => {
    try {
      setTasksData((t) =>
        updateObjById<TaskWithRelations>(t, taskId, {
          ...props,
        }),
      );
      if (onDone) {
        onDone();
      }
      await apiClient.patch(`/tasks/${taskId}`, props);
      toast({
        title: "Success",
        description: "Task has been updated",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (
    // todo: maybe rename
    taskId: string,
    onDone?: () => void,
  ) => {
    try {
      setTasksData((tasks) => tasks.filter((task) => task.id !== taskId));
      if (onDone) {
        onDone();
      }

      await apiClient.delete(`/tasks/${taskId}`);
      toast({
        title: "Success",
        description: "Task has been deleted",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: JSON.stringify(e),
        variant: "destructive",
      });
    }
  };
  return { editTask, deleteTask, createNewTask };
};

export default useEditTask;
