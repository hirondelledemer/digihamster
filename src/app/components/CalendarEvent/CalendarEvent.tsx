import React, { FC, useState } from "react";
import style from "./CalendarEvent.module.scss";
import { Event } from "react-big-calendar";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { Button } from "../ui/button";

export interface CalendarEventProps {
  testId?: string;
  event: Event;
  onDelete(eventId: string): void;
}

export const eventPropGetter = () => ({
  className: style.event,
});

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
  onDelete,
}): JSX.Element | null => {
  // todo: fix with hook
  const [completed, setCompleted] = useState<boolean>(event.resource.completed);

  const handleDeleteClick = async () => {
    await axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      deleted: true,
    });
    onDelete(event.resource.id);
  };

  const handleCompleteClick = () => {
    setCompleted(true);
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      completed: true,
    });
  };

  return (
    <div
      data-testid={testId}
      className={`h-full p-1 ${
        completed ? "text-muted-foreground line-through" : ""
      }`}
    >
      {event.title}
      <div className={style.actions}>
        <Button
          onClick={handleDeleteClick}
          title="Delete"
          size="icon"
          variant="ghost"
          className="h-5 w-5"
        >
          <IconTrash style={{ width: "60%", height: "60%" }} />
        </Button>
        {!completed && (
          <Button
            onClick={handleCompleteClick}
            title="Complete"
            size="icon"
            variant="ghost"
            className="h-5 w-5"
          >
            <IconCheck style={{ width: "60%", height: "60%" }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarEvent;
