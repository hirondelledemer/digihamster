import React, { FC, useState } from "react";
import style from "./CalendarEvent.module.scss";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { Event } from "react-big-calendar";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import axios from "axios";

export interface CalendarEventProps {
  testId?: string;
  event: Event;
}

export const eventPropGetter = () => ({
  className: style.event,
});

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
}): JSX.Element | null => {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(event.resource.completed);
  const handleDeleteClick = () => {
    setDeleted(true);
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      deleted: true,
    });
  };

  const handleCompleteClick = () => {
    setCompleted(true);
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      completed: true,
    });
  };

  if (deleted) {
    return null;
  }

  return (
    <Paper
      data-testid={testId}
      style={{ height: "100%", backgroundColor: "transparent" }}
    >
      <Text td={completed ? "line-through" : undefined}>{event.title}</Text>
      <div className={style.actions}>
        <ActionIcon
          onClick={handleDeleteClick}
          title="Edit"
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
