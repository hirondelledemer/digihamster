import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import HabitForm, { HabitFormProps } from "../HabitForm/HabitForm";

export interface HabitFormModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
}

const HabitFormModal: FC<HabitFormModalProps & HabitFormProps> = ({
  // TODO: move to habits folder
  testId,
  onClose,
  open,
  ...restProps
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
          <HabitForm {...restProps} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HabitFormModal;
