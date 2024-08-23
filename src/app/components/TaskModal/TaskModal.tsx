import React, { FC, ReactNode } from "react";

import { z } from "zod";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  isActive: z.union([z.boolean(), z.undefined()]),
  eta: z.number(),
  deadline: z.union([z.number(), z.null(), z.undefined()]),
  project: z.string().min(1, { message: "This field has to be filled." }),
  tags: z.array(z.string()),
});

export type FormValues = z.infer<typeof FormSchema>;

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
