"use client";

import React, { FC, useState } from "react";
import style from "./CalendarEvent.module.scss";
import { Event } from "react-big-calendar";
import axios from "axios";
import useEvents from "@/app/utils/hooks/use-events";
import { Event as EventType } from "@/models/event";
import { updateObjById } from "@/app/utils/common/update-array";
import { Badge } from "../ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import TaskForm from "../TaskForm";
import { FormValues } from "../TaskForm/TaskForm";
import useEditEvent from "@/app/utils/hooks/use-edit-events";

export interface CalendarEventType extends Event {
  title: string;
  resource: {
    id: string;
    completed?: boolean;
    type: "event" | "deadline" | "journal";
    note?: string;
    title?: string;
    description?: string;
    projectId?: string; // todo: rethink shape
  };
}

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

export const taskFormTestId = "CalendarEvent-task-form-test-id";

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
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editEvent } = useEditEvent();

  const handleDeleteClick = async () => {
    await axios.patch("/api/events", {
      eventId: event.resource.id,
      deleted: true,
    });
    setData((events) => events.filter((e) => e._id !== event.resource.id));
  };

  const handleCompleteClick = () => {
    setData((events) => {
      return updateObjById<EventType>(events, event.resource.id, {
        completed: true,
      });
    });
    axios.patch("/api/events", {
      eventId: event.resource.id,
      completed: true,
    });
  };

  return (
    // todo: this is copy/paste code: extract
    <>
      <Sheet open={taskFormOpen}>
        <SheetContent
          side="left"
          onCloseClick={() => setTaskFormOpen(false)}
          onEscapeKeyDown={() => setTaskFormOpen(false)}
        >
          <SheetHeader>
            <SheetTitle>Edit Event</SheetTitle>
            <SheetDescription>
              <TaskForm
                testId={taskFormTestId}
                editMode
                onSubmit={(data: FormValues) =>
                  editEvent(
                    event.resource.id,
                    {
                      title: data.title,
                      description: data.description,
                      projectId: data.project,
                    },
                    () => setTaskFormOpen(false)
                  )
                }
                initialValues={{
                  title: event.title,
                  project: event.resource.projectId,
                  description: event.resource.description,
                }}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ContextMenu>
        <ContextMenuTrigger disabled={event.resource.type === "deadline"}>
          <div
            data-testid={testId}
            className={`h-full p-1 ${
              event.resource.completed
                ? "text-muted-foreground line-through"
                : ""
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
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default CalendarEvent;
