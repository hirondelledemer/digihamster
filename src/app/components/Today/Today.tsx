"use client";

import React, { useMemo } from "react";
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
import { differenceInDays, lightFormat } from "date-fns";
import { CalendarEventType } from "../CalendarEvent";
import {
  CalendarDeadlineEntry,
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
} from "../CalendarEvent/CalendarEvent.types";
import useHabits from "@/app/utils/hooks/use-habits";
import TodayHabit from "../TodayHabit";
import { Habit } from "@/models/habit";

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

  const filteredHabits = useMemo(
    () =>
      habits.filter((habit) => {
        const todayTimestamp = min.getTime();

        const todayHabit = habit.log.find((log) => log.at === todayTimestamp);

        return !todayHabit;
      }),
    [habits, min, date]
  );

  const readyHabits = useMemo(
    () =>
      filteredHabits
        .filter(getHabitIsDue(date))
        .sort(byLastCompletedDate(date)),
    [filteredHabits, date]
  );

  const restHabits = useMemo(
    () =>
      filteredHabits
        .filter((h) => !getHabitIsDue(date)(h))
        .sort(byLastCompletedDate(date)),
    [filteredHabits, date]
  );
  return (
    <>
      <div className="flex flex-col">
        {!allDayEvents.length &&
          !regularEvents.length &&
          "There are not events today."}
        {allDayEvents.map(getTodayEventComp)}
        {regularEvents.sort(sortByTime).map(getTodayEventComp)}

        {!!readyHabits.length && (
          <Collapsible>
            <CollapsibleTrigger>
              <div className="flex mt-6">
                Ready for today ({readyHabits.length})
                <IconChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent data-testid={upcomingEventsTestId}>
              {readyHabits.map((habit) => (
                <TodayHabit key={habit._id} habit={habit} date={min} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {!!restHabits.length && (
          <Collapsible>
            <CollapsibleTrigger>
              <div className="flex mt-6">
                Other tasks
                <IconChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent data-testid={upcomingEventsTestId}>
              {restHabits.map((habit) => (
                <TodayHabit key={habit._id} habit={habit} date={min} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

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

function byLastCompletedDate(
  date: Date
): ((a: Habit, b: Habit) => number) | undefined {
  return (h1, h2) => {
    const lastLog1 = h1.log.findLast(
      (log) => log.at < date.getTime() && log.completed
    );
    const lastLog2 = h2.log.findLast(
      (log) => log.at < date.getTime() && log.completed
    );

    const diff1 = lastLog1 ? differenceInDays(date, lastLog1.at) : 29;
    const diff2 = lastLog2 ? differenceInDays(date, lastLog2.at) : 29;

    const averageAcceptableDiff1 = 28 / h1.timesPerMonth;
    const averageAcceptableDiff2 = 28 / h2.timesPerMonth;

    return diff2 - averageAcceptableDiff2 - (diff1 - averageAcceptableDiff1);
  };
}

function getHabitIsDue(date: Date): (value: Habit) => boolean {
  return (habit) => {
    const lastLog = habit.log.findLast(
      (log) => log.at < date.getTime() && log.completed
    );

    const diff = lastLog ? differenceInDays(date, lastLog.at) : 29;

    const averageAcceptableDiff = 28 / habit.timesPerMonth;

    const readyIn = Math.floor(averageAcceptableDiff - diff);

    return readyIn <= 0;
  };
}
