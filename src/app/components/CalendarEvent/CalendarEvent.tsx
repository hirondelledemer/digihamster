"use client";

import React, { FC } from "react";
import style from "./CalendarEvent.module.scss";
import { Event } from "react-big-calendar";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { Button } from "../ui/button";
import useEvents from "@/app/utils/hooks/use-events";
import { Task } from "@/models/task";
import { updateObjById } from "@/app/utils/common/update-array";
import { Badge } from "../ui/badge";

export interface CalendarEventType extends Event {
  resource: {
    id: string;
    completed?: boolean;
    type: "event" | "deadline" | "journal";
    note?: string;
    title?: string;
  };
}

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

export const eventPropGetter = (event: Event) => {
  return {
    className:
      event.resource.type === "deadline"
        ? style.eventWithDeadline
        : style.event,
  };
};

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
}): JSX.Element | null => {
  const { setData } = useEvents();
  const handleDeleteClick = async () => {
    await axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      deleted: true,
    });
    setData((events) => events.filter((e) => e._id !== event.resource.id));
  };

  const handleCompleteClick = () => {
    setData((events) => {
      return updateObjById<Task>(events, event.resource.id, {
        completed: true,
      });
    });
    axios.patch("/api/tasks/events", {
      taskId: event.resource.id,
      completed: true,
    });
  };

  return (
    <div
      data-testid={testId}
      className={`h-full p-1 ${
        event.resource.completed ? "text-muted-foreground line-through" : ""
      }`}
    >
      {event.title}
      {event.resource.type === "deadline" && (
        <div>
          <Badge variant="destructive">Deadline</Badge>
        </div>
      )}
      {/* todo: redo into context events  + redo month popup */}
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
        {!event.resource.completed && (
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
