"use client";

import React from "react";
import { Navigate, View } from "react-big-calendar";
import * as dates from "date-arithmetic";
import TodayEvent from "../TodayEvent";
import { IconChevronDown } from "@tabler/icons-react";
import MinimalNote from "../MinimalNote";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "../utils";
import { lightFormat } from "date-fns";
import { CalendarEventType } from "../CalendarEvent";
import {
  CalendarDeadlineEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
} from "../CalendarEvent/CalendarEvent.types";
import useHabits from "@/app/utils/hooks/use-habits";
import { Checkbox } from "../ui/checkbox";
import { Habit } from "@/models/habit";
import TodayHabit from "../TodayHabit";
import { DAY } from "@/app/utils/consts/dates";

export const todayEvent = "Today-today-event-test-id";
export const upcomingEventsTestId = "Today-upcoming-events-test-id";
export interface TodayProps {
  testId?: string;
  events: CalendarEventType[];
  date: Date;
  localizer: {
    endOf: (date: Date, view: View) => Date;
    startOf: (date: Date, view: View) => Date;
  };
}

function Today({ localizer, events, date }: TodayProps) {
  const max = localizer.endOf(date, "day");
  const min = localizer.startOf(date, "day");

  const { data: habits } = useHabits();

  const sortByTime = (event1: CalendarEventType, event2: CalendarEventType) =>
    (event1.start?.getTime() || 0) - (event2.start?.getTime() || 0);

  const upcomingEvents = events.filter((event: CalendarEventType) =>
    event.start ? dates.gt(event.start, max, "day") : false
  );

  const allDayEvents = events.filter((event: CalendarEventType) =>
    event.allDay && event.start
      ? dates.inRange(event.start, min, max, "day")
      : false
  );

  const regularEvents = events.filter((event: CalendarEventType) =>
    !event.allDay && event.start
      ? dates.inRange(event.start, min, max, "day")
      : false
  );

  const getTodayEventComp = (event: CalendarEventType) => {
    if (isCalendarJournalEntry(event)) {
      return (
        <div
          key={event.resource.id}
          className={cn([
            "grid grid-cols-3 gap-4 italic mt-4 text-muted-foreground",
          ])}
        >
          <div>{event.start ? lightFormat(event.start, "H:mm") : "???"}</div>
          <div className="col-span-2">
            <Collapsible>
              <CollapsibleTrigger className="italic">
                {event.title || "-"}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <MinimalNote note={event.resource.note} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      );
    }

    if (isCalendarEventEntry(event) || isCalendarDeadlineEntry(event)) {
      return (
        <TodayEvent key={event.resource.id} testId={todayEvent} event={event} />
      );
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {!allDayEvents.length &&
          !regularEvents.length &&
          "There are not events today."}
        {allDayEvents.map(getTodayEventComp)}
        {regularEvents.sort(sortByTime).map(getTodayEventComp)}

        <Collapsible>
          <CollapsibleTrigger>
            <div className="flex mt-6">
              Ready for today
              <IconChevronDown />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent data-testid={upcomingEventsTestId}>
            {habits
              .filter((habit) => {
                const todayTimestamp = min.getTime();

                const todayHabit = habit.log.find(
                  (log) => log.at === todayTimestamp
                );

                return !todayHabit;
              })
              .map((habit) => {
                const todayTimestamp = min.getTime();
                const earliestDay = todayTimestamp - 28 * DAY;
                const progress = habit.log.filter(
                  (log) => log.at >= earliestDay && log.completed
                ).length;
                const progressPercentage =
                  (progress / habit.timesPerMonth) * 100 || 0;

                return (
                  <TodayHabit
                    key={habit._id}
                    habit={habit}
                    date={min}
                    percentage={progressPercentage}
                  />
                );
              })}
          </CollapsibleContent>
        </Collapsible>

        {!!upcomingEvents.length && (
          <Collapsible>
            <CollapsibleTrigger>
              <div className="flex mt-6">
                Upcoming Events
                <IconChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent data-testid={upcomingEventsTestId}>
              {upcomingEvents
                .sort(sortByTime)
                .map((event: CalendarEventType) => (
                  <TodayEvent
                    key={event.resource.id}
                    testId={todayEvent}
                    showDate
                    event={event as CalendarDeadlineEntry}
                  />
                ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </>
  );
}

Today.range = (date: any, { localizer }: any) => {
  const start = date;
  const end = dates.add(start, 0, "day");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "day")) {
    range.push(current);
    current = localizer.add(current, 1, "day");
  }

  return range;
};

Today.navigate = (date: Date, action: string, { localizer }: any) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "day");

    case Navigate.NEXT:
      return localizer.add(date, 1, "day");

    default:
      return date;
  }
};

Today.title = (date: Date) => {
  return `${date.toLocaleDateString()}`;
};

export default Today;
