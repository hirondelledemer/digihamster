/**
 * A named stretch of time. Comes in two kinds, told apart by `kind`:
 *
 *   - `date_range`   one specific window - tomorrow, a weekend, a trip,
 *                    "December 2025 specifically".
 *                    Active when start <= date <= end.
 *   - `yearly_month` a month that comes round every year - "December" as a
 *                    seasonal vibe.
 *                    Active when date.month === month.
 *
 * The API sends `params` as raw JSON whose shape depends on `kind`, so this is
 * a discriminated union rather than one interface with optional fields:
 * narrowing on `kind` is what tells you which params you are holding, and the
 * compiler stops you reading `params.month` off a date range.
 */

export enum TimeSpaceKind {
  DateRange = "date_range",
  YearlyMonth = "yearly_month",
}

/** Calendar days, inclusive at both ends: "2026-11-26". */
export interface IDateRangeParams {
  start: string;
  end: string;
}

/** 1-12, January is 1 - not the 0-based month a JS `Date` hands you. */
export interface IYearlyMonthParams {
  month: number;
}

interface ITimeSpaceCommon {
  id: number;
  user_id: number;
  title: string;
  color?: string;
  created_at: string;
}

export interface IDateRangeTimeSpace extends ITimeSpaceCommon {
  kind: TimeSpaceKind.DateRange;
  params: IDateRangeParams;
}

export interface IYearlyMonthTimeSpace extends ITimeSpaceCommon {
  kind: TimeSpaceKind.YearlyMonth;
  params: IYearlyMonthParams;
}

export type ITimeSpace = IDateRangeTimeSpace | IYearlyMonthTimeSpace;
