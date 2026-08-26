"use client";

import React, { FC, useCallback, useMemo, useRef } from "react";

import {
  CalendarEventEntry,
  isCalendarEventEntry,
} from "./CalendarEvent.types";

import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { EventActions } from "../EventActions";
import { format } from "date-fns";
import { EventStatus } from "@/app/utils/types/event";
import { cn } from "../utils";
import { TaskStatus } from "@/app/utils/types/task";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useDroppable } from "@dnd-kit/core";
import { sortInTheEvent } from "@/app/utils/tasks/sort";
import { EventTask } from "./components/EventTask";

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

  const project = useProjectById(event.resource.event.project_id);

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
                <EventTask
                  key={t.id}
                  task={t}
                  onCompletedChange={handleTaskCompleteClick(t.id)}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }, [event, handleTaskCompleteClick]);

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
