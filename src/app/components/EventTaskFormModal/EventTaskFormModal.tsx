import React, { FC, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import TaskForm from "../TaskForm";
import EventForm from "../EventForm";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export interface EventTaskFormModalProps {
  testId?: string;
  open: boolean;
  onClose(): void;
  onDone(): void;
  initialValues: {
    startAt: number;
    endAt: number;
  };
}

const EventTaskFormModal: FC<EventTaskFormModalProps> = ({
  testId,
  open,
  onClose,
  onDone,
  initialValues,
}): JSX.Element => {
  const [formMode, setFormMode] = useState<"event" | "task">("event");

  const handleOnClose = () => {
    setFormMode("event");
    onClose();
  };
  const handleOnDone = () => {
    setFormMode("event");
    onDone();
  };

  return (
    <div data-testid={testId}>
      <Sheet open={open}>
        <SheetContent
          side="left"
          onCloseClick={handleOnClose}
          onEscapeKeyDown={handleOnClose}
          aria-describedby="Task Modal"
        >
          <SheetHeader>
            <SheetTitle>
              {formMode === "event" ? "Create event" : "Create Task"}
            </SheetTitle>
          </SheetHeader>
          <Label>Create as task</Label>
          <Switch
            checked={formMode === "task"}
            onCheckedChange={(val) => setFormMode(val ? "task" : "event")}
          />
          {formMode === "task" ? (
            <TaskForm
              editMode={false}
              onDone={handleOnDone}
              initialValues={{
                deadline: initialValues.startAt,
                title: "",
                description: "",
                tags: [],
                eta: 0.5,
              }}
            />
          ) : (
            <EventForm
              editMode={false}
              onDone={handleOnDone}
              initialValues={{
                startAt: initialValues.startAt,
                endAt: initialValues.endAt,
                title: "",
                description: "",
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EventTaskFormModal;
