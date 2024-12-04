import React, { FC, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import TaskForm from "../TaskForm";
import EventForm from "../EventForm";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { FormValues } from "../EventForm/EventForm";
import { FormValues as TaskFormValues } from "../TaskForm/TaskForm";

export interface EventTaskFormModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
  onSubmit(values: FormValues): void;
  initialValues: TaskFormValues;
}

const EventTaskFormModal: FC<EventTaskFormModalProps> = ({
  testId,
  open,
  onClose,
  onSubmit,
  initialValues,
}): JSX.Element => {
  const [formMode, setFormMode] = useState<"event" | "task">("event");

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
          <Label>Create as task</Label>
          <Switch
            checked={formMode === "task"}
            onCheckedChange={(val) => setFormMode(val ? "task" : "event")}
          />
          {formMode === "task" ? (
            <TaskForm
              editMode={false}
              onDone={onClose}
              initialValues={initialValues}
            />
          ) : (
            <EventForm onSubmit={onSubmit} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EventTaskFormModal;
