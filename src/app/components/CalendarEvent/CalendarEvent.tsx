"use client";

import React, { FC, useCallback, useMemo, useRef } from "react";

import {
  CalendarEventEntry,
  isCalendarEventEntry,
} from "./CalendarEvent.types";

import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { EventActions } from "../EventActions";
import { format } from "date-fns";
import { EventStatus } from "@/app/utils/types/event";
import { cn } from "../utils";
import { TaskStatus } from "@/app/utils/types/task";
import { Checkbox } from "../ui/checkbox";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useDroppable } from "@dnd-kit/core";
import { sortInTheEvent } from "@/app/utils/tasks/sort";

export interface CalendarEventProps {
  event: CalendarEventEntry;
}

const CalendarEvent: FC<CalendarEventProps> = ({
  event,
}): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const el = containerRef.current;
    if (!el) return;

    el.style.minHeight = `${el.offsetHeight}px`;
    el.style.height = "fit-content";
    el.style.overflow = "visible";
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;

    el.style.minHeight = "";
    el.style.height = "";
    el.style.overflow = "hidden";
  };

  const { getProjectById } = useProjectsState();

  const { updateTask } = useTasksNewActions();

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
  });

  const handleTaskCompleteClick = useCallback(
    (taskId: number) => (value: CheckedState) => {
      updateTask(taskId, {
        status: value ? TaskStatus.Done : TaskStatus.Doing,
      });
    },
    [updateTask],
  );

  const content = useMemo(() => {
    return (
      <div className="pb-5 h-fit">
        <div className="italic">
          <div>{event.title}</div>
          <div className="text-xs">{event.resource.event.description}</div>

          <div>
            {isCalendarEventEntry(event) &&
              sortInTheEvent(event.resource.tasks).map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "text-sm mt-1 border bg-card rounded-md p-1 flex items-center gap-2",
                  )}
                >
                  <Checkbox
                    checked={t.status === TaskStatus.Done}
                    onCheckedChange={handleTaskCompleteClick(t.id)}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    onMouseDownCapture={(event) => {
                      // the calendar listens for mousedown natively to start a
                      // slot selection, so it has to be stopped in the capture phase
                      event.stopPropagation();
                    }}
                  />
                  {t.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }, [event, handleTaskCompleteClick]);

  const project =
    event.resource.event.project_id &&
    getProjectById(event.resource.event.project_id);

  const projectColor = project
    ? `color-mix(in srgb, ${project.color} 20%, transparent)`
    : "";

  const getEventStatusColor = () => {
    if (event.resource.event.status === EventStatus.Completed) {
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-10)/0.4), hsl(var(--scale-color-10)/0.5) 3px, hsl(var(--scale-color-10)/0.1) 5px, hsl(var(--scale-color-10)/0.1) 20px)";
    }
    if (event.resource.event.status === EventStatus.Cancelled) {
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-1)/0.4), hsl(var(--scale-color-1)/0.5) 3px, hsl(var(--scale-color-1)/0.1) 5px, hsl(var(--scale-color-1)/0.1) 20px)";
    }
    if (event.resource.event.status === EventStatus.Moved) {
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-5)/0.4), hsl(var(--scale-color-5)/0.5) 3px, hsl(var(--scale-color-5)/0.1) 5px, hsl(var(--scale-color-5)/0.1) 20px)";
    }

    return "";
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(isOver ? "border-2 border-primary rounded-lg" : "")}
    >
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: projectColor || "#29221f",
          border: `2px solid ${projectColor || "hsl(var(--primary)/0.5)"}`,
        }}
        className="h-full p-1 cursor-pointer rounded-lg relative "
      >
        <EventActions event={event.resource.event}>
          {event.resource.event.status !== EventStatus.Pending && (
            <div
              className="h-full absolute top-0 bottom-0 left-0 right-0 rounded-md m-[1px]"
              style={{
                background: getEventStatusColor(),
              }}
            />
          )}
        </EventActions>
        <div className="text-xs absolute top-[-20px]">
          {format(event.start, "HH:mm")}
        </div>
        <EventActions event={event.resource.event} triggerClassName="h-full">
          {content}
        </EventActions>
        <div className="text-xs absolute bottom-[-20px]">
          {event.end && format(event.end, "HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvent;
