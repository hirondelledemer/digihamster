import { TaskV2 as Task } from "@/models/taskV2";
import useTasks from "./use-tasks";
import { updateObjById } from "../common/update-array";
import axios from "axios";
import { useToast } from "@/app/components/ui/use-toast";

const useEditTask = () => {
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

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
      onDone && onDone();
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
      onDone && onDone();
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
  return { editTask, deleteTask };
};

export default useEditTask;
