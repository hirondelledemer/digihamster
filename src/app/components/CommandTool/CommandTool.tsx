"use client";

import { FC, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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
import useTasks from "@/app/utils/hooks/use-tasks";
import axios from "axios";
import { updateObjById } from "@/app/utils/common/update-array";
import { useToast } from "../ui/use-toast";
import { TaskV2 as Task } from "@/models/taskV2";
import { HOME, TASKS } from "@/app/utils/consts/routes";

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
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();

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
      tags: [],
      ...taskData,
    };
    setTasksData((e) => [...e, tempTask]);
    setTaskFormOpen({ isActive: false, isOpen: false });
    setOpen(false);

    try {
      const response = await axios.post<Task>("/api/tasks/v2", taskData);
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

  const handleFilter = (value: string, search: string): 1 | 0 => {
    if (value.includes(search)) return 1;
    if (value === "create active task" || value === "create task") return 1;
    return 0;
  };

  const gotToTasks = useCallback(() => {
    router.push(TASKS);
  }, [router]);

  const goToHome = useCallback(() => {
    router.push(HOME);
  }, [router]);

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
              <TaskForm
                testId={taskFormTestId}
                onSubmit={createNewTask}
                initialValues={{ title: searchValue }}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <CommandDialog
        data-testid={commandToolTestId}
        open={open}
        onOpenChange={setOpen}
        filter={handleFilter}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
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
          <CommandGroup heading="Go to">
            <CommandItem onSelect={goToHome}>Home</CommandItem>
            <CommandItem onSelect={gotToTasks}>Tasks</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandTool;
