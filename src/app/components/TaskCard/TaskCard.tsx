import React, { FC } from "react";
import { Task } from "@/models/task";
import useProjects from "@/app/utils/hooks/use-projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import MinimalNote from "../MinimalNote";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import axios from "axios";
import useTasks from "@/app/utils/hooks/use-tasks";
import { updateObjById } from "@/app/utils/common/update-array";
import { useToast } from "../ui/use-toast";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  className?: string;
  task: Task;
}

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  className,
}): JSX.Element => {
  const { data: projects } = useProjects();
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

  const project = projects.find((p) => p._id === task.projectId);

  // show completed task differently
  // show completed tasks at the bottom
  // test commandtool

  const editTask = async (completed: boolean) => {
    try {
      setTasksData((t) =>
        updateObjById<Task>(t, task._id, {
          completed,
        })
      );
      await axios.patch("/api/tasks/events", {
        taskId: task._id,
        completed,
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

  return (
    <div data-testid={testId} className={className}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            data-testid={cardTestId}
            className={`w-[350px] p-0 rounded-md ${
              task.completed ? "opacity-40 line-through" : ""
            }`}
          >
            <CardHeader className="p-4">
              <CardTitle data-testid={titleTestId}>{task.title}</CardTitle>
              {!task.completed && (
                <CardDescription>
                  <div style={{ color: project?.color }}>{project?.title}</div>
                </CardDescription>
              )}
            </CardHeader>
            {task.description && !task.completed && (
              <CardContent className="px-4 text-xs">
                <MinimalNote note={task.description} />
              </CardContent>
            )}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {task.completed && (
            <ContextMenuItem inset onClick={() => editTask(false)}>
              Undo
            </ContextMenuItem>
          )}
          {!task.completed && (
            <ContextMenuItem inset onClick={() => editTask(true)}>
              Complete
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default TaskCard;
