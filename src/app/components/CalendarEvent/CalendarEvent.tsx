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
import { IconCloud, IconCloudRain, IconSun } from "@tabler/icons-react";
import { CalendarEventType } from "./CalendarEvent.types";

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

const getWeatherIcon = (
  weather: {
    main: string;
  }[]
) => {
  return weather.map((w, index) => {
    if (w.main === "Clear") {
      return <IconSun key={index} size={14} />;
    }
    if (w.main === "Clouds") {
      return <IconCloud key={index} size={14} />;
    }
    if (w.main === "Rain") {
      return <IconCloudRain key={index} size={14} />;
    }
    return w.main;
  });
};

export const taskFormTestId = "CalendarEvent-task-form-test-id";

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

  if (event.resource.type === "journal") {
    return null;
  }

  if (event.resource.type === "weather") {
    return (
      <div className="pt-1 flex text-xs items-center pointer-events-none justify-end relative z-10">
        <div>{Math.floor(event.resource.temp || 0)}</div>
        <div>{getWeatherIcon(event.resource.weather || [])}</div>
      </div>
    );
  }

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
            className={`h-full p-1 italic cursor-pointer bg-[#29221f] pl-4 rounded-lg hover:border hover:border-primary mt-[-1px]${
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
