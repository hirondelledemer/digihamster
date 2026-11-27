import { useMemo } from "react";

import { toBackendDate } from "@/utils/date";

import { ITimeSpace, TimeSpaceKind } from "../../types/time-space";
import { useTimeSpacesState } from "./state-context";

/**
 * Is `date` inside this time space?
 *
 * The date range arm compares "2026-11-26"-shaped strings rather than Dates.
 * That is deliberate: those strings sort lexicographically in date order, so
 * string comparison IS date comparison, and it keeps the whole check in the
 * user's calendar days instead of crossing into UTC instants where a
 * late-evening "today" turns into tomorrow.
 */
export const isTimeSpaceActive = (
  timeSpace: ITimeSpace,
  date: Date
): boolean => {
  switch (timeSpace.kind) {
    case TimeSpaceKind.DateRange: {
      const day = toBackendDate(date);
      return timeSpace.params.start <= day && day <= timeSpace.params.end;
    }
    case TimeSpaceKind.YearlyMonth:
      // getMonth() is 0-based, params.month is 1-based
      return date.getMonth() + 1 === timeSpace.params.month;
  }
};

/**
 * The time spaces covering `date`, specific windows before seasonal ones - a
 * trip you are actually on says more about the day than "it is December".
 */
export const useActiveTimeSpaces = (date: Date): ITimeSpace[] => {
  const { data } = useTimeSpacesState();

  return useMemo(
    () =>
      data
        .filter((timeSpace) => isTimeSpaceActive(timeSpace, date))
        .sort((a, b) => {
          if (a.kind !== b.kind) {
            return a.kind === TimeSpaceKind.DateRange ? -1 : 1;
          }

          return a.title.localeCompare(b.title);
        }),
    [data, date]
  );
};
