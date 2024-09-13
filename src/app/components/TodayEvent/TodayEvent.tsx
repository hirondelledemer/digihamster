"use client";

import { lightFormat, format } from "date-fns";
import React, { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { Event } from "@/models/event";
import useEvents from "@/app/utils/hooks/use-events";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import { updateObjById } from "@/app/utils/common/update-array";
import { Badge } from "../ui/badge";
import {
  CalendarDeadlineEntry,
  CalendarEventEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
} from "../CalendarEvent/CalendarEvent.types";
import TaskCard from "../TaskCard";

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
  const { setData } = useEvents();

  // todo: use
  const handleCompleteClick = async (val: boolean) => {
    await axios.patch<Event>("/api/events", {
      eventId: event.resource.id,
      completed: val,
    });

    setData((events) =>
      updateObjById<Event>(events, event.resource.id, { completed: val })
    );
  };

  return (
    <div>
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
