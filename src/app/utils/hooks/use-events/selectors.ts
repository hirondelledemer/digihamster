"use client";
import { useMemo } from "react";
import { isSameDay, isWithinInterval, startOfDay } from "date-fns";
import { parseBackendDateTime } from "#utils/date";
import { IEvent } from "../../types/event";
import { now } from "../../date/now";
import { useEventsState } from "./state-context";

const byStart = (event1: IEvent, event2: IEvent) =>
  parseBackendDateTime(event1.start_at).getTime() -
  parseBackendDateTime(event2.start_at).getTime();

/**
 * The events that start on the given day, earliest first.
 *
 * Keyed on the start of the day, so passing a freshly built Date for the same
 * day does not recompute.
 */
export const useEventsForDay = (date: Date): IEvent[] => {
  const { data } = useEventsState();
  const day = startOfDay(date).getTime();

  return useMemo(
    () =>
      data
        .filter(
          (event) =>
            !!event.start_at &&
            isSameDay(parseBackendDateTime(event.start_at), day),
        )
        .sort(byStart),
    [data, day],
  );
};

/**
 * The event that is happening at the moment, if there is one. All day events
 * are not counted — they say nothing about what is going on right now.
 *
 * Deliberately not memoized: the answer depends on the clock, so a memo would
 * hand back a stale event. The result is an event straight out of the state,
 * so its identity is stable as long as the event itself does not change.
 */
export const useCurrentEvent = (): IEvent | undefined => {
  const { data } = useEventsState();

  return data.find(
    (event) =>
      !event.all_day &&
      !!event.start_at &&
      !!event.end_at &&
      isWithinInterval(now(), {
        start: parseBackendDateTime(event.start_at),
        end: parseBackendDateTime(event.end_at),
      }),
  );
};
