import { Task } from "@/models/task";
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
    onDone: () => void
  ) => {
    try {
      setTasksData((t) =>
        updateObjById<Task>(t, taskId, {
          ...props,
        })
      );
      // onDone&& .setTaskFormOpen(false);
      onDone && onDone();
      await axios.patch("/api/tasks/events", {
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
  return { editTask };
};

export default useEditTask;
