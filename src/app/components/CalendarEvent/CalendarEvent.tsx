"use client";

import React, { FC, useState } from "react";

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
import EventForm from "../EventForm";

import {
  CalendarEventType,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "./CalendarEvent.types";
import { cn } from "../utils";
import TaskFormModal from "../TaskFormModal";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

export const taskFormTestId = "CalendarEvent-task-form-test-id";

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
}): JSX.Element | null => {
  const { editTask } = useEditTask();

  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const { delete: deleteEvent, update: updateEvent } = useEventsActions();
  const { getProjectById } = useProjectsState();

  const handleDeleteClick = async () => {
    if (isCalendarDeadlineEntry(event)) {
      editTask(event.resource.id, { deleted: true });
    } else {
      deleteEvent(event.resource.id);
    }
  };

  const handleCompleteClick = () => {
    if (isCalendarDeadlineEntry(event)) {
      editTask(event.resource.id, { completed: true });
    } else {
      updateEvent(event.resource.id, { completed: true });
    }
  };

  const handleSendBackToListClick = async () => {
    editTask(event.resource.id, { deadline: null });
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
                <EventForm
                  testId={taskFormTestId}
                  editMode
                  event={{
                    _id: event.resource.id,
                    title: event.title,
                    description: event.resource.description || "",
                    completed: event.resource.completed || false,
                    deleted: false,
                    projectId: event.resource.projectId || "",
                    allDay: event.allDay || false,
                    startAt: event.start.valueOf(),
                    endAt: (event.end || 0).valueOf(),
                    tags: [],
                    updatedAt: "",
                  }}
                  onDone={() => setEventFormOpen(false)}
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
                    getProjectById(event.resource.task.projectId || "")!.color
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
          <ContextMenuItem inset onClick={handleDeleteClick}>
            Delete
          </ContextMenuItem>
          {!event.resource.completed && (
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
          {isCalendarDeadlineEntry(event) && (
            <ContextMenuItem inset onClick={handleSendBackToListClick}>
              Move back to list
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default CalendarEvent;
