import React, { FC } from "react";

import TaskModal from "../TaskModal";
import TaskForm from "../TaskForm";
import { TaskModalProps } from "../TaskModal/TaskModal";
import { TaskFormProps } from "../TaskForm/TaskForm";
import CreateTaskForm from "../CreateTaskForm";
import { CreateTaskFormProps } from "../CreateTaskForm/CreateTaskForm";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

export type TaskFormModalProps = Omit<TaskModalProps, "children"> &
  ((TaskFormProps & { editMode: boolean }) | CreateTaskFormProps);

const TaskFormModal: FC<TaskFormModalProps> = ({
  testId,
  open,
  onClose,
  ...taskFormProps
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      <TaskModal open={open} onClose={onClose}>
        {"editMode" in taskFormProps && taskFormProps.editMode ? (
          <TaskForm {...taskFormProps} />
        ) : (
          <CreateTaskForm {...taskFormProps} />
        )}
      </TaskModal>
    </div>
  );
};

export default TaskFormModal;
