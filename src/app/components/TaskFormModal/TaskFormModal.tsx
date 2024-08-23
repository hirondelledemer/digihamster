import React, { FC } from "react";

import { z } from "zod";
import TaskModal from "../TaskModal";
import TaskForm from "../TaskForm";
import { TaskModalProps } from "../TaskModal/TaskModal";
import { TaskFormProps } from "../TaskForm/TaskForm";

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

type TaskFormModalProps = Omit<TaskModalProps, "children"> & TaskFormProps;

const TaskFormModal: FC<TaskFormModalProps> = ({
  testId,
  open,
  onClose,
  ...taskFormProps
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      <TaskModal open={open} onClose={onClose}>
        <TaskForm {...taskFormProps} />
      </TaskModal>
    </div>
  );
};

export default TaskFormModal;
