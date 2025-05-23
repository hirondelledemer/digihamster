"use client";

import React, { FC, useMemo } from "react";

import {
  CalendarEventType,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
  isCalendarWeatherEntry,
} from "./CalendarEvent.types";
import { cn } from "../utils";

import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { TaskActions } from "../TaskActions";
import { EventActions } from "../EventActions";

export interface CalendarEventProps {
  testId?: string;
  event: CalendarEventType;
}

export const taskFormTestId = "CalendarEvent-task-form-test-id";

const CalendarEvent: FC<CalendarEventProps> = ({
  testId,
  event,
}): JSX.Element | null => {
  const { getProjectById } = useProjectsState();

  const content = useMemo(() => {
    if (
      event.resource.type === "journal" ||
      event.resource.type === "weather"
    ) {
      return null;
    }

    return (
      <div
        data-testid={testId}
        style={{
          border: isCalendarDeadlineEntry(event)
            ? `2px solid ${
                getProjectById(event.resource.task.projectId || "")?.color ??
                "#000"
              }`
            : "",
        }}
        className={cn(
          "h-full p-1 cursor-pointer bg-[#29221f] rounded-lg hover:border hover:border-primary mt-[-1px]",
          event.resource.completed && "text-muted-foreground line-through"
        )}
      >
        <div className={`italic`}>
          {event.title}
          <div>
            {isCalendarEventEntry(event) &&
              event.resource.tasks.map((t) => (
                <div
                  key={t._id}
                  className="text-sm mt-1 border bg-card rounded-md p-1"
                >
                  {t.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }, [event, getProjectById, testId]);

  if (isCalendarJournalEntry(event) || isCalendarWeatherEntry(event)) {
    return null;
  }
  if (isCalendarDeadlineEntry(event)) {
    return <TaskActions task={event.resource.task}>{content}</TaskActions>;
  }
  return <EventActions event={event}>{content}</EventActions>;
};

export default CalendarEvent;
