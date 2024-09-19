import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import HabitForm, { HabitFormProps } from "../HabitForm/HabitForm";

export interface HabitFormModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
}

const HabitFormModal: FC<HabitFormModalProps & HabitFormProps> = ({
  testId,
  onClose,
  open,
  ...restProps
}): JSX.Element => {
  return (
    <div data-testid={testId}>
      {/* <TaskModal open={open} onClose={onClose}> */}
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
          <HabitForm {...restProps} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HabitFormModal;
