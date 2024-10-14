"use client";

import React, { FC, useState } from "react";

import axios from "axios";
import useEvents from "@/app/utils/hooks/use-events";
import { Event as EventType } from "@/models/event";
import { updateObjById } from "@/app/utils/common/update-array";
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
import {
  CalendarEventType,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "./CalendarEvent.types";
import { cn } from "../utils";
import useProjects from "@/app/utils/hooks/use-projects";
import TaskFormModal from "../TaskFormModal";

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
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const { editEvent } = useEditEvent();
  const { getProjectById } = useProjects();

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

  const closeTaskForm = () => setTaskFormOpen(false);

  return (
    <>
      {isCalendarDeadlineEntry(event) && (
        <TaskFormModal
          editMode
          open={taskFormOpen}
          onDone={closeTaskForm}
          onClose={closeTaskForm}
          task={event.resource.task}
        />
      )}
      {isCalendarEventEntry(event) && (
        <Sheet open={eventFormOpen}>
          <SheetContent
            side="left"
            onCloseClick={() => setEventFormOpen(false)}
            onEscapeKeyDown={() => setEventFormOpen(false)}
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
      )}
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            data-testid={testId}
            style={{
              border: isCalendarDeadlineEntry(event)
                ? `2px solid ${
                    getProjectById(event.resource.task.projectId || "").color
                  }`
                : "",
            }}
            className={cn(
              "h-full p-1 cursor-pointer bg-[#29221f] rounded-lg hover:border hover:border-primary mt-[-1px]",
              event.resource.completed && "text-muted-foreground line-through"
            )}
          >
            <div className={`italic`}>
              {event.title}
              <div>
                {isCalendarEventEntry(event) &&
                  event.resource.tasks.map((t) => (
                    <div
                      key={t._id}
                      className="text-sm mt-1 border bg-card rounded-md p-1"
                    >
                      {t.title}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {isCalendarEventEntry(event) && (
            <ContextMenuItem inset onClick={handleDeleteClick}>
              Delete
            </ContextMenuItem>
          )}
          {!event.resource.completed && isCalendarEventEntry(event) && (
            <ContextMenuItem inset onClick={handleCompleteClick}>
              Complete
            </ContextMenuItem>
          )}
          {isCalendarEventEntry(event) && (
            <ContextMenuItem inset onClick={() => setEventFormOpen(true)}>
              Edit
            </ContextMenuItem>
          )}
          {isCalendarDeadlineEntry(event) && (
            <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
              Edit
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default CalendarEvent;
