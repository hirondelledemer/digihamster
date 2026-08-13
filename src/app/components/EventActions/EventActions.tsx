import React, { ReactNode, useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
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
import { addDays } from "date-fns";
import { toBackendDateTime } from "#utils/date";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";

interface EventActionsProps {
  event: IEvent;
  children: ReactNode;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  children,
}) => {
  const {
    delete: deleteEvent,
    update: updateEvent,
    create,
  } = useEventsActions();

  const { updateTask } = useTasksNewActions();
  const { data: tasks } = useTasksNewState();
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);

  const handleDeleteClick = async () => {
    deleteEvent(event.id);
  };

  const handleStatusChange = (status: EventStatus) => {
    updateEvent(event.id, { status });
  };

  const handleMoving = async (to: "day" | "week") => {
    updateEvent(event.id, { status: EventStatus.Moved });
    const { id: _, ...restOfEvent } = event;

    const eventToCreate = {
      ...restOfEvent,
      title: `(Moved) ${restOfEvent.title}`,
      start_at: toBackendDateTime(
        addDays(restOfEvent.start_at, to === "day" ? 1 : 7),
      ),
      end_at: toBackendDateTime(
        addDays(restOfEvent.end_at, to === "day" ? 1 : 7),
      ),
    };

    const newEvent = await create(eventToCreate);
    console.log(newEvent);

    if (!newEvent) {
      return null;
    }

    tasks
      .filter((task) => task.event_id === event.id)
      .forEach((task) => {
        updateTask(task.id, { event_id: newEvent.id });
      });
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
              onClick={() => handleStatusChange(EventStatus.Completed)}
            >
              Complete
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Cancelled && (
            <ContextMenuItem
              onClick={() => handleStatusChange(EventStatus.Cancelled)}
            >
              Cancel
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Moved && (
            <ContextMenuSub>
              <ContextMenuSubTrigger>Move</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuGroup>
                  <ContextMenuItem onClick={() => handleMoving("day")}>
                    To tomorrow
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleMoving("week")}>
                    To next week
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}
          {event.status !== EventStatus.Pending && (
            <ContextMenuItem
              onClick={() => handleStatusChange(EventStatus.Pending)}
            >
              Undo
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={handleDeleteClick}>Delete</ContextMenuItem>
          <ContextMenuItem onClick={() => setEventFormOpen(true)}>
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
