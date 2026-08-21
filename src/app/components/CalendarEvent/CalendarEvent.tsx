"use client";

import React, { FC, useMemo, useRef } from "react";

import {
  CalendarEventType,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
  isCalendarWeatherEntry,
} from "./CalendarEvent.types";

import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { EventActions } from "../EventActions";
import { format } from "date-fns";

export interface CalendarEventProps {
  event: CalendarEventType;
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
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;

    el.style.minHeight = "";
    el.style.height = "";
  };

  const { getProjectById } = useProjectsState();

  const content = useMemo(() => {
    if (
      event.resource.type === "journal" ||
      event.resource.type === "weather" ||
      event.resource.type === "deadline"
    ) {
      return null;
    }

    return (
      <div>
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

  if (
    isCalendarJournalEntry(event) ||
    isCalendarWeatherEntry(event) ||
    isCalendarDeadlineEntry(event)
  ) {
    return null;
  }

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
      className="h-full p-1 cursor-pointer rounded-lg"
    >
      <div className="text-xs absolute top-[-15px]">
        {format(event.start, "HH:mm")}
      </div>
      <EventActions event={event.resource.event} triggerClassName="h-full">
        {content}
      </EventActions>
    </div>
  );
};

export default CalendarEvent;
