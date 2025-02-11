import { TaskV2 as Task } from "@/models/taskV2";
import useTasks from "./use-tasks";
import { updateObjById } from "../common/update-array";
import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";
import { now } from "../date/date";

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
    data: Pick<Task, FieldsRequired> & { subtasks: string[] }
  ) => {
    const tempId = "temp-id";

    const tempTask: Task = {
      _id: tempId,
      completed: false,
      deleted: false,
      sortOrder: null,
      completedAt: undefined,
      activatedAt: undefined,
      parentTaskId: null,
      createdAt: now().toDateString(),
      updatedAt: now().toDateString(),
      ...data,
    };
    setTasksData((e) => [...e, tempTask]);

    try {
      const response = await axios.post<Task>("/api/tasks/v2", data);
      setTasksData((e) => updateObjById<Task>(e, tempId, response.data));
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
    props: Partial<Task>,
    onDone?: () => void
  ) => {
    try {
      setTasksData((t) =>
        updateObjById<Task>(t, taskId, {
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
