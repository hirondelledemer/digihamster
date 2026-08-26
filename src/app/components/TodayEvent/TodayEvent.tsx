"use client";

import { lightFormat, format } from "date-fns";
import React, { FC, useEffect, useRef } from "react";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  CalendarWeatherEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "../CalendarEvent/CalendarEvent.types";
import { useDroppable } from "@dnd-kit/core";
import CalendarWeatherEvent from "../CalendarWeatherEvent";
import { useTaskProject } from "@/app/utils/hooks/use-projects/selectors";
import { TaskActions } from "../TaskActions";
import { EventActions } from "../EventActions";
import { DraggableTaskCard } from "../TaskCard/DraggableTaskCard";
import { EventStatus } from "@/app/utils/types/event";
import { sortInTheEvent } from "@/app/utils/tasks/sort";

export interface TodayEventProps {
  showDate?: boolean;
  event: CalendarEventEntry | CalendarDeadlineEntry;
  weatherEvent?: CalendarWeatherEntry;
  isFocused: boolean;
}

const eventStyles = {
  [EventStatus.Completed]: styles.containerCompleted,
  [EventStatus.Moved]: styles.containerMoved,
  [EventStatus.Cancelled]: styles.containerCancelled,
  [EventStatus.Pending]: undefined,
};

const TodayEvent: FC<TodayEventProps> = ({
  showDate,
  event,
  weatherEvent,
  isFocused,
}): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.scrollIntoView(false);
    }
  }, [isFocused]);

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
    disabled: isCalendarDeadlineEntry(event),
  });

  const project = useTaskProject(
    isCalendarDeadlineEntry(event) ? event.resource.task : null,
  );

  const eventIsCompleted = isCalendarDeadlineEntry(event)
    ? event.resource.completed
    : isCalendarEventEntry(event)
      ? event.resource.event.status === EventStatus.Completed
      : false;

  return (
    <div ref={setNodeRef} className={cn(isOver ? "border border-primary" : "")}>
      <div
        className={cn([
          "grid grid-cols-3 gap-4 italic p-2",
          eventIsCompleted ? styles.container : "",
          isCalendarEventEntry(event)
            ? eventStyles[event.resource.event.status]
            : "",
          isCalendarDeadlineEntry(event) && event.resource.completed
            ? styles.containerCompleted
            : "",
          isFocused ? "bg-muted" : "",
        ])}
        data-testid={"today-event-container"}
      >
        {isCalendarEventEntry(event) && event.allDay ? (
          <div className="flex">All Day</div>
        ) : (
          <div className="flex">
            {event.start && showDate && (
              <div>{format(event.start, "MMM d, EEEEE")}</div>
            )}
            {event.start && event.end && (
              <div className="flex items-center gap-1">
                <div>
                  {lightFormat(new Date(event.start), "H:mm")}-
                  {lightFormat(new Date(event.end), "H:mm")}
                </div>
                {weatherEvent && <CalendarWeatherEvent event={weatherEvent} />}
              </div>
            )}
          </div>
        )}
        <div>
          {isCalendarDeadlineEntry(event) ? (
            <TaskActions task={event.resource.task}>
              <div ref={ref}>
                {event.title}
                {project && (
                  <span
                    className="ml-4"
                    style={{
                      color: project.color,
                      opacity: event.resource.completed ? 0.7 : 1,
                    }}
                  >
                    {project.title}
                  </span>
                )}
              </div>
            </TaskActions>
          ) : (
            <EventActions event={event.resource.event}>
              <div ref={ref}>{event.title}</div>
            </EventActions>
          )}

          <div>
            {isCalendarEventEntry(event) && (
              <span className="text-xs">
                {event.resource.event.description}
              </span>
            )}
            {isCalendarDeadlineEntry(event) && (
              <span className="text-xs">{event.resource.task.description}</span>
            )}
            {isCalendarEventEntry(event) && (
              <div className="grid gap-2">
                {sortInTheEvent(event.resource.tasks).map((t) => (
                  <DraggableTaskCard key={t.id} task={t} dragId={t.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayEvent;
