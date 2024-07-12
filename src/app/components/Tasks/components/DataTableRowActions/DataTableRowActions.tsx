"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";
import { useState } from "react";
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

// import { Button } from "@/registry/new-york/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuShortcut,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuSubTrigger,
//   DropdownMenuTrigger,
// } from "@/registry/new-york/ui/dropdown-menu";

// import { labels } from "../data/data";
// import { taskSchema } from "../data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

// todo: brain fog
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.null(), z.undefined()]),
  estimate: z.union([z.number(), z.undefined(), z.null()]),
  projectId: z.union([z.string(), z.null()]),
  deadline: z.union([z.number(), z.undefined(), z.null()]),
  isActive: z.boolean() || z.undefined(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editTask } = useEditTask();

  const activateTask = () => {
    editTask(task._id, {
      isActive: true,
    });
  };
  const deactivateTask = () => {
    editTask(task._id, {
      isActive: false,
    });
  };

  // todo: delete should be different hook
  const deleteTask = () => {
    editTask(task._id, {
      deleted: true,
    });
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
          {/* todo: open edit on task click */}
          <DropdownMenuItem onClick={() => setTaskFormOpen(true)}>
            Edit
          </DropdownMenuItem>
          {!task.isActive && (
            <DropdownMenuItem onClick={activateTask}>Activate</DropdownMenuItem>
          )}
          {task.isActive && (
            <DropdownMenuItem onClick={deactivateTask}>
              Deactivate
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteTask}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
