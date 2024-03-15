import React, { FC, useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../TaskForm";
import { FormValues } from "../TaskForm/TaskForm";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface TaskCardProps {
  testId?: string;
  className?: string;
  task: Task;
}

export const taskFormTestId = "TaskCard-task-form-test-id";

const TaskCard: FC<TaskCardProps> = ({
  testId,
  task,
  className,
}): JSX.Element => {
  const { data: projects } = useProjects();
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);

  const project = projects.find((p) => p._id === task.projectId);

  const editTask = async (props: Partial<Task>) => {
    try {
      setTasksData((t) =>
        updateObjById<Task>(t, task._id, {
          ...props,
        })
      );
      setTaskFormOpen(false);
      await axios.patch("/api/tasks/events", {
        taskId: task._id,
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

  return (
    <div data-testid={testId} className={className}>
      <Sheet open={taskFormOpen}>
        <SheetContent
          side="left"
          onCloseClick={() => setTaskFormOpen(false)}
          onEscapeKeyDown={() => setTaskFormOpen(false)}
        >
          <SheetHeader>
            <SheetTitle>Create Task</SheetTitle>
            <SheetDescription>
              <TaskForm
                testId={taskFormTestId}
                onSubmit={(data: FormValues) =>
                  editTask({
                    title: data.title,
                    description: data.description,
                    estimate: data.eta,
                    projectId: data.project,
                  })
                }
                initialValues={{
                  title: task.title,
                  description: task.description,
                  eta: task.estimate,
                  project: task.projectId,
                }}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            data-testid={cardTestId}
            className={`w-[350px] p-0 rounded-md ${
              task.completed ? "opacity-40 line-through" : ""
            }`}
          >
            <CardHeader className="p-4">
              <CardTitle data-testid={titleTestId} className="font-normal">
                {task.title}
              </CardTitle>
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
            <ContextMenuItem
              inset
              onClick={() => editTask({ completed: false })}
            >
              Undo
            </ContextMenuItem>
          )}
          {!task.completed && (
            <ContextMenuItem
              inset
              onClick={() => editTask({ completed: true })}
            >
              Complete
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={() => editTask({ isActive: false })}>
            Deactivate
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default TaskCard;
