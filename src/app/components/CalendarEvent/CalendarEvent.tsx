"use client";

import React, { FC } from "react";
import style from "./CalendarEvent.module.scss";
import { Event } from "react-big-calendar";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { Button } from "../ui/button";
import useEvents from "@/app/utils/hooks/use-events";
import { ITask } from "@/models/task";
import { ObjectId } from "mongoose";

export interface CalendarEventProps {
  testId?: string;
  event: Event;
}

export const eventPropGetter = () => ({
  className: style.event,
});

// todo: extract
function update<T extends { _id: ObjectId }>(
  arr: T[],
  id: ObjectId,
  updatedData: Partial<T>
) {
  return arr.map((item) =>
    item._id === id ? { ...item, ...updatedData } : item
  );
}

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
      return update<ITask>(events, event.resource.id, { completed: true });
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
