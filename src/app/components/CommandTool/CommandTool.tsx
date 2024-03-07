// import React, { FC } from 'react';
// import style from './CommandTool.module.scss';

"use client";

import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import useHotKeys from "@/app/utils/hooks/use-hotkeys";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../TaskForm";
import { FormValues } from "../TaskForm/TaskForm";
import { Task } from "@/models/task";
import useTasks from "@/app/utils/hooks/use-tasks";
import axios from "axios";
import { updateObjById } from "@/app/utils/common/update-array";
import { useToast } from "../ui/use-toast";

// export interface CommandToolProps {
//   testId?: string;
// }

// const CommandTool: FC<CommandToolProps> = ({ testId }): JSX.Element => {
//   return <div data-testid={testId}>CommandTool</div>;
// };

// export default CommandTool;

function CommandTool() {
  const [open, setOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  useHotKeys([["mod+K", () => setOpen((open) => !open)]]);
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

  const createNewTask = async (data: FormValues) => {
    // todo: add error handler

    type FieldsRequired =
      | "title"
      | "description"
      | "projectId"
      | "tags"
      | "isActive"
      | "estimate";

    const taskData: Pick<Task, FieldsRequired> = {
      title: data.title,
      description: data.description.content,
      projectId: data.project,
      tags: data.description.tags,
      isActive: true,
      estimate: data.eta,
    };
    const tempId = "temp-id";

    const tempTask: Task = {
      _id: tempId,
      completed: false,
      deleted: false,
      sortOrder: null,
      completedAt: 0,
      activatedAt: 0,
      parentTaskId: null,
      createdAt: 0,
      updatedAt: 0,
      event: null,
      ...taskData,
    };
    setTasksData((e) => [...e, tempTask]);
    setTaskFormOpen(false);
    setOpen(false);

    try {
      const response = await axios.post<Task>("/api/tasks/events", taskData);
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

  return (
    <>
      <Sheet open={taskFormOpen}>
        <SheetContent side="left" onCloseClick={() => setTaskFormOpen(false)}>
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
            <SheetDescription>
              <TaskForm onSubmit={createNewTask} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setTaskFormOpen(true)}>
              Create Active Task
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandTool;
