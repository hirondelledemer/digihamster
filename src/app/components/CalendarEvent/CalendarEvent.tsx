"use client";

import React, { FC, useState } from "react";

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
import TaskForm from "../EventForm";
import { FormValues } from "../TaskForm/TaskForm";
import useEditEvent from "@/app/utils/hooks/use-edit-events";
import { CalendarEventType } from "./CalendarEvent.types";
import { useDroppable } from "@dnd-kit/core";

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

export const taskFormTestId = "CalendarEvent-task-form-test-id";

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
}): JSX.Element | null => {
  const { setData } = useEvents();
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editEvent } = useEditEvent();

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
  });

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

  if (event.resource.type === "journal" || event.resource.type === "weather") {
    return null;
  }

  return (
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
            className={`h-full p-1 cursor-pointer bg-[#29221f] pl-4 rounded-lg hover:border hover:border-primary mt-[-1px]${
              event.resource.completed
                ? "text-muted-foreground line-through"
                : ""
            } ${event.resource.type === "deadline" ? "bg-[#2B1B1E]" : ""} ${isOver ? "border border-primary" : ""}`}
            ref={setNodeRef}
          >
            {isOver && (
              <span className="absolute bottom-[50%]">
                Add task to this event
              </span>
            )}
            <div className={`italic ${isOver ? "blur-sm" : ""}`}>
              {event.title}
              {event.resource.type === "deadline" && (
                <div>
                  <Badge variant="destructive">Deadline</Badge>
                </div>
              )}
            </div>
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
