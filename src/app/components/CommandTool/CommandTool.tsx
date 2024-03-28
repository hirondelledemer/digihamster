"use client";

import { FC, useState } from "react";
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

export interface CommandToolProps {
  testId?: string;
}

export const commandToolTestId = "CommandTool-command-testid";
export const taskFormTestId = "CommandTool-task-form-testid";

const CommandTool: FC<CommandToolProps> = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<{
    isOpen: boolean;
    isActive: boolean;
  }>({ isOpen: false, isActive: false });
  useHotKeys([["mod+K", () => setOpen((open) => !open)]]);
  const { setData: setTasksData } = useTasks();
  const { toast } = useToast();

  const createNewTask = async (data: FormValues) => {
    type FieldsRequired =
      | "title"
      | "description"
      | "projectId"
      | "isActive"
      | "estimate"
      | "deadline";

    const taskData: Pick<Task, FieldsRequired> = {
      title: data.title,
      description: data.description,
      projectId: data.project,
      isActive: taskFormOpen.isActive,
      estimate: data.eta,
      deadline: data.deadline || null,
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
      tags: [],
      ...taskData,
    };
    setTasksData((e) => [...e, tempTask]);
    setTaskFormOpen({ isActive: false, isOpen: false });
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
      <Sheet open={taskFormOpen.isOpen}>
        <SheetContent
          side="left"
          onCloseClick={() =>
            setTaskFormOpen({ isActive: false, isOpen: false })
          }
          onEscapeKeyDown={() =>
            setTaskFormOpen({ isActive: false, isOpen: false })
          }
        >
          <SheetHeader>
            <SheetTitle>Create Task</SheetTitle>
            <SheetDescription>
              <TaskForm testId={taskFormTestId} onSubmit={createNewTask} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <CommandDialog
        data-testid={commandToolTestId}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => setTaskFormOpen({ isOpen: true, isActive: true })}
            >
              Create Active Task
            </CommandItem>
            <CommandItem
              onSelect={() =>
                setTaskFormOpen({ isOpen: true, isActive: false })
              }
            >
              Create Task
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandTool;
