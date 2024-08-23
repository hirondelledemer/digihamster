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
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { z } from "zod";
import TaskFormModal from "@/app/components/TaskFormModal";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// todo: this is not okey. data should be normalized
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.undefined(), z.null()]),
  estimate: z.union([z.number(), z.undefined(), z.null()]),
  projectId: z.union([z.string(), z.null()]),
  deadline: z.union([z.number(), z.undefined(), z.null()]),
  isActive: z.boolean() || z.undefined(),
  completed: z.boolean(),
  deleted: z.boolean(),
  sortOrder: z.union([z.number(), z.undefined()]),
  completedAt: z.union([z.number(), z.undefined()]),
  activatedAt: z.union([z.number(), z.undefined(), z.null()]),
  parentTaskId: z.union([z.string(), z.null(), z.undefined()]),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
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

  const closeTaskForm = () => setTaskFormOpen(false);

  return (
    <>
      <TaskFormModal
        onDone={closeTaskForm}
        onClose={closeTaskForm}
        editMode
        task={task}
        open={taskFormOpen}
      />

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
