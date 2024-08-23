import React, { FC, ReactNode } from "react";

import { z } from "zod";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

export interface TaskModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
  children: ReactNode;
}

const TaskFormModal: FC<TaskModalProps> = ({
  testId,
  open,
  onClose,
  children,
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      <Sheet open={open}>
        <SheetContent
          side="left"
          onCloseClick={onClose}
          onEscapeKeyDown={onClose}
          aria-describedby="Task Form Modal"
        >
          <SheetHeader>
            <SheetTitle>Create Task</SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskFormModal;
