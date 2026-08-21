"use client";

import React, { FC, useMemo } from "react";

import {
  CalendarEventType,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
  isCalendarWeatherEntry,
} from "./CalendarEvent.types";

import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { EventActions } from "../EventActions";

export interface CalendarEventProps {
  event: CalendarEventType;
}

const CalendarEvent: FC<CalendarEventProps> = ({
  event,
}): JSX.Element | null => {
  const { getProjectById } = useProjectsState();

  const content = useMemo(() => {
    if (
      event.resource.type === "journal" ||
      event.resource.type === "weather" ||
      event.resource.type === "deadline"
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
        style={{
          backgroundColor: projectColor || "#29221f",
          border: `2px solid ${projectColor || "hsl(var(--primary)/0.5)"}`,
        }}
        className="h-full p-1 cursor-pointer rounded-lg"
      >
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
  }, [event, getProjectById]);

  if (
    isCalendarJournalEntry(event) ||
    isCalendarWeatherEntry(event) ||
    isCalendarDeadlineEntry(event)
  ) {
    return null;
  }

  return (
    <EventActions event={event.resource.event} triggerClassName="h-full">
      {content}
    </EventActions>
  );
};

export default CalendarEvent;
