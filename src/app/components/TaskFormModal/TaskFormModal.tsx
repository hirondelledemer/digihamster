import React, { FC } from "react";

import TaskModal from "../TaskModal";
import TaskForm from "../TaskForm";
import { TaskModalProps } from "../TaskModal/TaskModal";
import { TaskFormProps } from "../TaskForm/TaskForm";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

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
