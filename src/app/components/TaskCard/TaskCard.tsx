import React, { FC, useState } from "react";
import { Task } from "@/models/task";
import useProjects from "@/app/utils/hooks/use-projects";
import { differenceInCalendarDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../TaskForm";
import { FormValues } from "../TaskForm/TaskForm";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import Estimate from "../Estimate";
import { now } from "@/app/utils/date/date";
import DinosaurIcon from "../icons/DinosaurIcon";
import useEditTask from "@/app/utils/hooks/use-edit-task";

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

  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editTask } = useEditTask();

  const project = projects.find((p) => p._id === task.projectId);
  const taskIsStale = differenceInCalendarDays(task.activatedAt, now()) > 7;

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
                editMode
                onSubmit={(data: FormValues) =>
                  editTask(
                    task._id,
                    {
                      title: data.title,
                      description: data.description,
                      estimate: data.eta,
                      projectId: data.project,
                    },
                    () => setTaskFormOpen(false)
                  )
                }
                initialValues={{
                  title: task.title,
                  description: task.description,
                  eta: task.estimate,
                  project: task.projectId,
                  deadline: task.deadline,
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
              <CardTitle
                data-testid={titleTestId}
                className="font-normal flex items-center justify-between"
              >
                <div>
                  {task.title}
                  {task.deadline && (
                    <span className="text-destructive ml-4">
                      {format(new Date(task.deadline), "MM-dd")}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {taskIsStale && (
                    <DinosaurIcon className="h-4 w-4 fill-gray-200 mr-2" />
                  )}
                  <Estimate estimate={task.estimate} />
                </div>
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
            {task.deadline && (
              <CardFooter className="p-4">
                <Badge variant="destructive">Deadline</Badge>
              </CardFooter>
            )}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: false }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Undo
            </ContextMenuItem>
          )}
          {!task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: true }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Complete
            </ContextMenuItem>
          )}
          <ContextMenuItem
            inset
            onClick={() =>
              editTask(task._id, { isActive: false }, () =>
                setTaskFormOpen(false)
              )
            }
          >
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
