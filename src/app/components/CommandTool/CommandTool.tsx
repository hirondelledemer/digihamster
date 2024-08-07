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
import TaskForm from "../TaskForm";
import { HOME, TASKS } from "@/app/utils/consts/routes";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export interface CommandToolProps {
  testId?: string;
}

export const commandToolTestId = "CommandTool-command-testid";
export const taskFormTestId = "CommandTool-task-form-testid";

const CommandTool: FC<CommandToolProps> = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<{
    open: boolean;
    taskIsActive: boolean;
  }>({ open: false, taskIsActive: false });

  useHotKeys([["mod+K", () => setOpen((open) => !open)]]);
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();

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

  const close = () => {
    setTaskFormOpen({ open: false, taskIsActive: false });
    setOpen(false);
  };

  return (
    <>
      {taskFormOpen.open && (
        <TaskForm
          testId={taskFormTestId}
          onDone={close}
          initialValues={{
            isActive: taskFormOpen.taskIsActive,
            title: searchValue,
          }}
          onClose={close}
          open={taskFormOpen.open}
        />
      )}
      <CommandDialog
        data-testid={commandToolTestId}
        open={open}
        onOpenChange={setOpen}
        filter={handleFilter}
      >
        <DialogTitle className="hidden" />
        <CommandInput
          placeholder="Type a command or search..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setTaskFormOpen({ open: true, taskIsActive: true });
              }}
            >
              Create Active Task
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTaskFormOpen({ open: true, taskIsActive: false });
              }}
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
