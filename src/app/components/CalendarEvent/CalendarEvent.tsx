import React, { FC, useState } from "react";
import style from "./CalendarEvent.module.scss";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { Event } from "react-big-calendar";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import axios from "axios";

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

  console.log("CalendarEvent", event);
  return (
    <Paper
      data-testid={testId}
      style={{ height: "100%", backgroundColor: "transparent" }}
    >
      <Text td={completed ? "line-through" : undefined}>{event.title}</Text>
      <div className={style.actions}>
        <ActionIcon
          onClick={handleDeleteClick}
          title="Delete"
          size="xs"
          variant="subtile"
        >
          <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        {!completed && (
          <ActionIcon
            onClick={handleCompleteClick}
            title="Complete"
            size="xs"
            variant="subtile"
          >
            <IconCheck style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
        )}
      </div>
    </Paper>
  );
};

export default CalendarEvent;
