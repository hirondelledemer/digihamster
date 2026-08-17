import React, { ReactNode, useState } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
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
import { addDays, format } from "date-fns";
import { toBackendDateTime } from "#utils/date";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { CheckIcon } from "lucide-react";
import {
  IconBackspace,
  IconCalendar,
  IconCancel,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

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
    const { id: _, ...restOfEvent } = event;

    const newStartDate = addDays(restOfEvent.start_at, to === "day" ? 1 : 7);
    const newEndDate = addDays(restOfEvent.end_at, to === "day" ? 1 : 7);

    const newDescription =
      `(Moved to the ${format(newStartDate, "MM-dd")})\n` +
      restOfEvent.description;

    updateEvent(event.id, {
      status: EventStatus.Moved,
      description: newDescription,
    });

    const eventToCreate = {
      ...restOfEvent,
      title: `(Moved) ${restOfEvent.title}`,
      start_at: toBackendDateTime(newStartDate),
      end_at: toBackendDateTime(newEndDate),
    };

    const newEvent = await create(eventToCreate);

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
        <ContextMenuTrigger className="h-full">{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuGroup>
            {event.status !== EventStatus.Completed && (
              <ContextMenuItem
                onClick={() => handleStatusChange(EventStatus.Completed)}
              >
                <CheckIcon />
                Complete
              </ContextMenuItem>
            )}
            {event.status !== EventStatus.Moved && (
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <IconCalendar />
                  Move
                </ContextMenuSubTrigger>
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
          </ContextMenuGroup>
          {event.status !== EventStatus.Cancelled && (
            <ContextMenuItem
              onClick={() => handleStatusChange(EventStatus.Cancelled)}
            >
              <IconCancel />
              Cancel
            </ContextMenuItem>
          )}
          {event.status !== EventStatus.Pending && (
            <ContextMenuItem
              onClick={() => handleStatusChange(EventStatus.Pending)}
            >
              <IconBackspace />
              Undo
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => setEventFormOpen(true)}>
            <IconEdit />
            Edit
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDeleteClick} variant="destructive">
            <IconTrash />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
