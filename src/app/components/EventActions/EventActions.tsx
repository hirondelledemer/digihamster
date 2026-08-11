import React, { ReactNode, useState } from "react";

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
import EventForm from "../EditEventForm";
import { EventStatus, IEvent } from "@/app/utils/types/event";

interface EventActionsProps {
  event: IEvent;
  children: ReactNode;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  children,
}) => {
  const { delete: deleteEvent, update: updateEvent } = useEventsActions();
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const handleDeleteClick = async () => {
    deleteEvent(event.id);
  };

  const handleStatusChange = (status: EventStatus) => {
    updateEvent(event.id, { status });
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
              <EventForm event={event} onDone={() => setEventFormOpen(false)} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {event.status !== EventStatus.Completed && (
            <ContextMenuItem
              inset
              onClick={() => handleStatusChange(EventStatus.Completed)}
            >
              Complete
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Cancelled && (
            <ContextMenuItem
              inset
              onClick={() => handleStatusChange(EventStatus.Cancelled)}
            >
              Cancel
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Moved && (
            <ContextMenuItem
              inset
              onClick={() => handleStatusChange(EventStatus.Moved)} // todo: handle moved properly
            >
              Move
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Pending && (
            <ContextMenuItem
              inset
              onClick={() => handleStatusChange(EventStatus.Pending)}
            >
              Undo
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={handleDeleteClick}>
            Delete
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setEventFormOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
