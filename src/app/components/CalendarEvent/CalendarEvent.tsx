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
import { EventStatus } from "@/app/utils/types/event";

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

  const eventIsCompleted = isCalendarDeadlineEntry(event)
    ? event.resource.completed
    : isCalendarEventEntry(event)
      ? event.resource.event.status === EventStatus.Completed
      : false;

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
                getProjectById(event.resource.task.project_id?.toString() || "")
                  ?.color ?? "#000"
              }`
            : "",
        }}
        className={cn(
          "h-full p-1 cursor-pointer bg-[#29221f] rounded-lg hover:border hover:border-primary mt-[-1px]",
          eventIsCompleted && "text-muted-foreground line-through",
        )}
      >
        <div className={`italic`}>
          {event.title}
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
  }, [event, testId, getProjectById, eventIsCompleted]);

  if (isCalendarJournalEntry(event) || isCalendarWeatherEntry(event)) {
    return null;
  }
  if (isCalendarDeadlineEntry(event)) {
    return <TaskActions task={event.resource.task}>{content}</TaskActions>;
  }
  return (
    <EventActions event={event.resource.event} triggerClassName="h-full">
      {content}
    </EventActions>
  );
};

export default CalendarEvent;
