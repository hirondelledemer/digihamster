import { toBackendDate } from "@/utils/date";

import { ITimeSpace, TimeSpaceKind } from "../../types/time-space";

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
