"use client";

import React, { FC, useMemo, useRef } from "react";

import { CalendarEventEntry } from "./CalendarEvent.types";

import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import { EventActions } from "../EventActions";
import { format } from "date-fns";
import { EventStatus } from "@/app/utils/types/event";
import { cn } from "../utils";
import { useDroppable } from "@dnd-kit/core";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  IconBubbleFilled,
  IconCheckbox,
  IconManFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export interface CalendarEventProps {
  event: CalendarEventEntry;
}

const CalendarEvent: FC<CalendarEventProps> = ({
  event,
}): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
  });

  const content = useMemo(() => {
    return (
      <div className="pb-5 h-fit">
        <div className="italic">
          <div>{event.title}</div>
          <div className="text-xs">{event.resource.event.description}</div>

          <div className="flex space-between pt-2 gap-4">
            {event.resource.tasks.length + event.resource.habits.length > 0 && (
              <div className="flex gap-1">
                <IconCheckbox size={16} />
                {event.resource.tasks.length + event.resource.habits.length}
              </div>
            )}
            {event.resource.journalEntries.length > 0 && (
              <div className="flex gap-1">
                <IconBubbleFilled size={16} />
                {event.resource.journalEntries.length}
              </div>
            )}
            <div className="flex gap-1">
              {event.resource.people.map((person) => (
                <div key={person.id}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger
                      className="pointer-events-auto"
                      onMouseDownCapture={(e) => {
                        // the calendar starts a slot selection on a native mousedown
                        e.stopPropagation();
                      }}
                    >
                      <IconManFilled size={16} color={person.color} />
                    </TooltipTrigger>
                    <TooltipContent className="w-[200px]" side="right">
                      {person.name}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }, [event]);

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
      return "repeating-linear-gradient(45deg, hsl(var(--scale-color-5)/0.1), hsl(var(--scale-color-5)/0.2) 3px, hsl(var(--scale-color-5)/0.1) 5px, hsl(var(--scale-color-5)/0.1) 20px)";
    }

    return "";
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: projectColor || "#29221f",
        border: `2px solid ${projectColor || "hsl(var(--primary)/0.5)"}`,
      }}
      className={cn(
        "h-full cursor-pointer rounded-lg relative",
        isOver ? "" : "p-1"
      )}
      onClick={() =>
        router.push(`/?eventId=${event.resource.event.id}`, undefined)
      }
    >
      <div
        ref={setNodeRef}
        className={cn(
          isOver ? "border-2 border-primary rounded-lg h-full w-full p-1" : ""
        )}
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
