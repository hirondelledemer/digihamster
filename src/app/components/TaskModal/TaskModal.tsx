import React, { FC, ReactNode } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export interface TaskModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
  children: ReactNode;
}

const TaskModal: FC<TaskModalProps> = ({
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
          aria-describedby="Task Modal"
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

export default TaskModal;
