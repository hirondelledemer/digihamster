import React, { ReactNode, useState } from "react";
import { CalendarEventEntry } from "../CalendarEvent/CalendarEvent.types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import EventForm from "../EventForm";

interface EventActionsProps {
  event: CalendarEventEntry;
  children: ReactNode;
}

export const taskFormTestId = "CalendarEvent-task-form-test-id";

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  children,
}) => {
  const { delete: deleteEvent, update: updateEvent } = useEventsActions();
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const handleDeleteClick = async () => {
    deleteEvent(event.resource.id);
  };

  const handleCompleteClick = () => {
    updateEvent(event.resource.id, { completed: true });
  };

  return (
    <>
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
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem inset onClick={handleDeleteClick}>
            Delete
          </ContextMenuItem>
          {!event.resource.completed && (
            <ContextMenuItem inset onClick={handleCompleteClick}>
              Complete
            </ContextMenuItem>
          )}

          <ContextMenuItem inset onClick={() => setEventFormOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
