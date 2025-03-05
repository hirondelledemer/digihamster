"use client";

import React, { useMemo, useState } from "react";
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
import { closestIndexTo, differenceInDays, lightFormat } from "date-fns";
import { CalendarEventType } from "../CalendarEvent";
import {
  isCalendarDeadlineEntry,
  isCalendarEventEntry,
  isCalendarJournalEntry,
  isCalendarWeatherEntry,
} from "../CalendarEvent/CalendarEvent.types";
import useHabits from "@/app/utils/hooks/use-habits";
import TodayHabit from "../TodayHabit";
import { Habit } from "@/models/habit";
import useHotKeys from "@/app/utils/hooks/use-hotkeys";

export interface TodayProps {
  testId?: string;
  events: CalendarEventType[];
  backgroundEvents: CalendarEventType[];
  date: Date;
  localizer: {
    endOf: (date: Date, view: View) => Date;
    startOf: (date: Date, view: View) => Date;
  };
}

function Today({ localizer, events, date, backgroundEvents }: TodayProps) {
  const max = localizer.endOf(date, "day");
  const min = localizer.startOf(date, "day");

  const [currentFocused, setCurrentFocused] = useState(-1);

  const { data: habits } = useHabits();

  const sortByTime = (event1: CalendarEventType, event2: CalendarEventType) =>
    (event1.start?.getTime() || 0) - (event2.start?.getTime() || 0);

  const allDayEvents = useMemo(
    () =>
      events.filter((event: CalendarEventType) =>
        event.allDay && event.start
          ? dates.inRange(event.start, min, max, "day")
          : false
      ),
    [events, max, min]
  );

  const regularEvents = useMemo(
    () =>
      events.filter((event: CalendarEventType) =>
        !event.allDay && event.start
          ? dates.inRange(event.start, min, max, "day")
          : false
      ),
    [events, max, min]
  );

  useHotKeys([
    [
      "ArrowDown",
      () => {
        if (currentFocused + 1 < regularEvents.length + allDayEvents.length)
          setCurrentFocused((val) => val + 1);
      },
    ],
    [
      "ArrowUp",
      () => {
        if (currentFocused > 0) {
          setCurrentFocused((val) => val - 1);
        }
      },
    ],
  ]);

  const getTodayEventComp =
    // eslint-disable-next-line react/display-name
    (initialIndex: number) => (event: CalendarEventType, i: number) => {
      const index = initialIndex + i;
      if (isCalendarJournalEntry(event)) {
        return (
          <div
            key={event.resource.id}
            className={cn([
              "grid grid-cols-3 gap-4 italic p-2 text-muted-foreground",
              index === currentFocused ? "bg-muted" : "",
            ])}
          >
            <div>{event.start ? lightFormat(event.start, "H:mm") : "???"}</div>
            <div className="col-span-2">
              <Collapsible autoFocus={index === currentFocused}>
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

      const weatherEvents = backgroundEvents.filter(isCalendarWeatherEntry);
      if (isCalendarEventEntry(event) || isCalendarDeadlineEntry(event)) {
        const weatherEventDates = weatherEvents.map((event) => event.start);

        const closestWeatherEventIndex = closestIndexTo(
          event.start,
          weatherEventDates
        );

        return (
          <TodayEvent
            key={event.resource.id}
            isFocused={index === currentFocused}
            event={event}
            weatherEvent={
              closestWeatherEventIndex
                ? weatherEvents[closestWeatherEventIndex]
                : undefined
            }
          />
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
    [habits, min]
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
        {allDayEvents.map(getTodayEventComp(0))}
        {regularEvents
          .sort(sortByTime)
          .map(getTodayEventComp(allDayEvents.length))}

        {!!readyHabits.length && (
          <Collapsible>
            <CollapsibleTrigger>
              <div className="flex mt-6">
                Ready for today ({readyHabits.length})
                <IconChevronDown />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            <CollapsibleContent>
              {restHabits.map((habit) => (
                <TodayHabit key={habit._id} habit={habit} date={min} />
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
