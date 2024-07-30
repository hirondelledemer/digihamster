"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";
import { MouseEvent, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import TaskForm from "@/app/components/TaskForm";
import { FormValues } from "@/app/components/TaskForm/TaskForm";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { z } from "zod";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.null(), z.undefined()]),
  estimate: z.union([z.number(), z.undefined(), z.null()]),
  projectId: z.union([z.string(), z.null(), z.undefined()]),
  deadline: z.union([z.number(), z.undefined(), z.null()]),
  isActive: z.boolean() || z.undefined(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editTask, deleteTask } = useEditTask();

  const handleActivateClick = (event: MouseEvent) => {
    event.stopPropagation();
    editTask(task._id, {
      isActive: true,
    });
  };

  const handleDeactivateClick = (event: MouseEvent) => {
    event.stopPropagation();
    editTask(task._id, {
      isActive: false,
    });
  };

  const handleEditClick = (event: MouseEvent) => {
    event.stopPropagation();
    setTaskFormOpen(true);
  };

  const handleDeleteClick = (event: MouseEvent) => {
    event.stopPropagation();
    deleteTask(task._id);
  };

  return (
    <>
      <Sheet open={taskFormOpen}>
        <SheetContent
          side="left"
          onCloseClick={() => setTaskFormOpen(false)}
          onEscapeKeyDown={() => setTaskFormOpen(false)}
        >
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>
              <TaskForm
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
                  description: task.description || "",
                  eta: task.estimate || 0,
                  project: task.projectId || undefined,
                  deadline: task.deadline,
                }}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          {!task.isActive && (
            <DropdownMenuItem onClick={handleActivateClick}>
              Activate
            </DropdownMenuItem>
          )}
          {task.isActive && (
            <DropdownMenuItem onClick={handleDeactivateClick}>
              Deactivate
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteClick}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
