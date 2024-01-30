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

  return (
    <Paper
      data-testid={testId}
      style={{ height: "100%", backgroundColor: "transparent" }}
    >
      <Text size="xs" td={completed ? "line-through" : undefined}>
        {event.title}
      </Text>
      <div className={style.actions}>
        <ActionIcon
          onClick={handleDeleteClick}
          title="Delete"
          size="xs"
          variant="default"
          color="gray"
        >
          <IconTrash style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
        {!completed && (
          <ActionIcon
            onClick={handleCompleteClick}
            title="Complete"
            size="xs"
            variant="default"
            color="gray"
          >
            <IconCheck style={{ width: "70%", height: "70%" }} />
          </ActionIcon>
        )}
      </div>
    </Paper>
  );
};

export default CalendarEvent;
