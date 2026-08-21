"use client";

import React, { FC, useMemo, useRef } from "react";

import {
  CalendarEventEntry,
  isCalendarEventEntry,
} from "./CalendarEvent.types";

import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { EventActions } from "../EventActions";
import { format } from "date-fns";

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

  const content = useMemo(() => {
    return (
      <div className="pb-5 h-fit">
        <div className="italic">
          <div>{event.title}</div>
          <div className="text-xs">{event.resource.event.description}</div>

          <div>
            {isCalendarEventEntry(event) &&
              event.resource.tasks.map((t) => (
                <div
                  key={t.id}
                  className="text-sm mt-1 border bg-card rounded-md p-1"
                >
                  {t.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }, [event]);

  const project =
    event.resource.event.project_id &&
    getProjectById(event.resource.event.project_id);

  const projectColor = project
    ? `color-mix(in srgb, ${project.color} 20%, transparent)`
    : "";

  return (
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
  );
};

export default CalendarEvent;
