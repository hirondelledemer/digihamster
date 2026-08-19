"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "../../../ui/button";
import { useState } from "react";
import TaskFormModal from "@/app/components/TaskFormModal";
import { TaskActions } from "@/app/components/TaskActions";
import { ITask } from "@/app/utils/types/task";

interface DataTableRowActionsProps {
  row: Row<ITask>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const task = row.original;
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);

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

      <TaskActions task={task}>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </TaskActions>
    </>
  );
}
