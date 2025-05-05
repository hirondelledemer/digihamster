import useTasks from "./use-tasks";
import { updateObjById } from "../common/update-array";
import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";
import { now } from "../date/date";
import { TaskWithRelations } from "../types/task";

type FieldsRequired =
  | "title"
  | "description"
  | "projectId"
  | "isActive"
  | "estimate"
  | "deadline"
  | "tags";

export const useEditTask = () => {
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

  const createNewTask = async (
    data: Pick<TaskWithRelations, FieldsRequired> & {
      subtasks: string[];
      primaryTaskId?: string;
    }
  ) => {
    const tempId = "temp-id";

    const tempTask: TaskWithRelations = {
      _id: tempId,
      completed: false,
      deleted: false,
      sortOrder: null,
      completedAt: undefined,
      activatedAt: undefined,
      parentTaskId: null,
      createdAt: now().toDateString(),
      updatedAt: now().toDateString(),
      relatedTaskIds: [],
      relatedNoteIds: [],
      ...data,
    };
    setTasksData((e) => [...e, tempTask]);

    try {
      await axios.post<TaskWithRelations>("/api/tasks/v2", data);

      const response = await axios.get<TaskWithRelations[]>("/api/tasks/v2");

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
    onDone?: () => void
  ) => {
    try {
      setTasksData((t) =>
        updateObjById<TaskWithRelations>(t, taskId, {
          ...props,
        })
      );
      if (onDone) {
        onDone();
      }
      await axios.patch("/api/tasks/v2", {
        taskId,
        ...props,
      });
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
    onDone?: () => void
  ) => {
    try {
      setTasksData((tasks) => tasks.filter((task) => task._id !== taskId));
      if (onDone) {
        onDone();
      }

      await axios.patch("/api/tasks/v2", {
        taskId,
        deleted: true,
      });
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
