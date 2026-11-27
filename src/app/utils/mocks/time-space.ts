import {
  IDateRangeTimeSpace,
  ITimeSpace,
  IYearlyMonthTimeSpace,
  TimeSpaceKind,
} from "../types/time-space";

export const generateDateRangeTimeSpace: (
  i?: number,
  properties?: Partial<IDateRangeTimeSpace>
) => IDateRangeTimeSpace = (i = 1, properties) => {
  return {
    id: i,
    user_id: 1,
    title: `Time space ${i}`,
    color: "#FF6B6B",
    kind: TimeSpaceKind.DateRange,
    params: { start: "2026-11-26", end: "2026-11-28" },
    created_at: "2026-11-01T00:00:00Z",
    ...properties,
  };
};

export const generateYearlyMonthTimeSpace: (
  i?: number,
  properties?: Partial<IYearlyMonthTimeSpace>
) => IYearlyMonthTimeSpace = (i = 1, properties) => {
  return {
    id: i,
    user_id: 1,
    title: `Time space ${i}`,
    color: "#339AF0",
    kind: TimeSpaceKind.YearlyMonth,
    params: { month: 12 },
    created_at: "2026-11-01T00:00:00Z",
    ...properties,
  };
};

export const generateListOfTimeSpaces: (count: number) => ITimeSpace[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateDateRangeTimeSpace(i));
};
