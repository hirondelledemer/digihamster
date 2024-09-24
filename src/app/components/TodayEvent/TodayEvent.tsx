"use client";

import { lightFormat, format } from "date-fns";
import React, { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import { Badge } from "../ui/badge";
import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "../CalendarEvent/CalendarEvent.types";
import TaskCard from "../TaskCard";
import { useDroppable } from "@dnd-kit/core";
import useEditEvent from "@/app/utils/hooks/use-edit-events";

export interface TodayEventProps {
  testId?: string;
  showDate?: boolean;
  event: CalendarEventEntry | CalendarDeadlineEntry;
}

const TodayEvent: FC<TodayEventProps> = ({
  testId,
  showDate,
  event,
}): JSX.Element => {
  const { editEvent } = useEditEvent();

  const { isOver, setNodeRef } = useDroppable({
    id: event.resource.id,
    disabled: isCalendarDeadlineEntry(event),
  });

  const handleCompleteClick = async (val: boolean) => {
    editEvent(event.resource.id, { completed: val });
  };

  return (
    <div ref={setNodeRef} className={cn(isOver ? "border border-primary" : "")}>
      <div
        className={cn([
          "grid grid-cols-3 gap-4 italic mt-4",
          event.resource.completed ? "text-muted-foreground" : "",
          event.resource.completed ? styles.container : "",
        ])}
        data-testid={testId}
      >
        {isCalendarEventEntry(event) && event.allDay ? (
          <div className="flex">All Day</div>
        ) : (
          <div className="flex">
            {event.start && showDate && (
              <div>{format(event.start, "MMM d, EEEEE")}</div>
            )}
            {event.start && event.end && (
              <div>
                {lightFormat(event.start, "H:mm")}-
                {lightFormat(event.end, "H:mm")}
              </div>
            )}
          </div>
        )}
        <div>
          <div>
            {event.title}
            {isCalendarDeadlineEntry(event) && (
              <Badge
                className="ml-4"
                variant={event.resource.completed ? "secondary" : "destructive"}
              >
                Deadline
              </Badge>
            )}
          </div>
          <div>
            {isCalendarEventEntry(event) &&
              event.resource.tasks.map((t) => (
                <TaskCard key={t._id} task={t} />
              ))}
          </div>
        </div>

        <div className="flex justify-end self-baseline">
          <Checkbox
            checked={event.resource.completed}
            onCheckedChange={handleCompleteClick}
            variant={event.resource.completed ? "secondary" : "default"}
          />
        </div>
      </div>
    </div>
  );
};

export default TodayEvent;
