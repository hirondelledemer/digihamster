"use client";

import React, { FC } from "react";
import style from "./CalendarEvent.module.scss";
import { Event } from "react-big-calendar";
import axios from "axios";
import useEvents from "@/app/utils/hooks/use-events";
import { Task } from "@/models/task";
import { updateObjById } from "@/app/utils/common/update-array";
import { Badge } from "../ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

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
    <ContextMenu>
      <ContextMenuTrigger>
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
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={handleDeleteClick}>
          Delete
        </ContextMenuItem>
        {!event.resource.completed && (
          <ContextMenuItem inset onClick={handleCompleteClick}>
            Complete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CalendarEvent;
