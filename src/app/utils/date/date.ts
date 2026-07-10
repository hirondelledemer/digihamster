import { subDays, format, formatISO, parseISO } from "date-fns";

export const now = () => new Date();

export const getTodayWithZeroHours = () => {
  const today = now();
  today.setHours(0, 0, 0, 0);
  return today;
};

// TODO: add commentary. Maybe rename
export const getTimestampsFrom = (startingDate: Date, howMany: number) => {
  const array = [];
  for (let i = 0; i <= howMany; i++) {
    array.push(subDays(startingDate, i).getTime());
  }
  return array.reverse();
};

/**
 * Date/time conversion helpers for the digihamster client.
 *
 * Use these everywhere you cross the network boundary or display a date to
 * the user. They enforce the API conventions (see datetime.md).
 *
 * Two kinds of date fields exist in the API:
 *   - Instant       (e.g. event.start_at)        → ISO 8601 UTC: "2026-05-28T13:00:00Z"
 *   - Calendar day  (e.g. habit_log.log_date)    → bare date:    "2026-05-28"
 *
 * Pick the right pair of functions for each. If you mix them you will get
 * off-by-one-day bugs near midnight and DST breakage.
 *
 * Dependency: date-fns (`npm i date-fns`).
 */

// ─── Instants (events, created_at, anything with a clock) ────────────────────

/**
 * Convert a local Date (e.g. from a date/time picker) to the UTC ISO 8601
 * string the API expects for instant fields.
 *
 * @example
 *   const pick = new Date(2026, 4, 28, 15, 0); // user picked May 28, 3pm
 *   toBackendDateTime(pick); // → "2026-05-28T12:00:00.000Z" for user in UTC+3
 */
export function toBackendDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Parse an ISO 8601 instant string from the API into a Date.
 * The Date holds a UTC moment; pass it to formatDateTimeForUser to render.
 */
export function parseBackendDateTime(s: string): Date {
  return parseISO(s);
}

/**
 * Format an instant in the user's local timezone for display.
 *
 * @param fmt date-fns format string. Defaults to localized "May 28, 2026, 3:00 PM"
 * @example
 *   formatDateTimeForUser(parseBackendDateTime(event.start_at))
 *   formatDateTimeForUser(date, "HH:mm")
 */
export function formatDateTimeForUser(date: Date, fmt: string = "PPp"): string {
  return format(date, fmt);
}

// ─── Calendar days (habit logs, anything with no clock) ──────────────────────

/**
 * Convert a local Date to a YYYY-MM-DD string for calendar-day fields.
 * The day used is the day in the USER's local timezone — exactly what you
 * want for "did I do this today?" semantics.
 *
 * Do NOT use date.toISOString().slice(0,10) — that's UTC date, which is the
 * wrong day for users east/west of UTC near midnight.
 */
export function toBackendDate(date: Date): string {
  return formatISO(date, { representation: "date" });
}

/**
 * Get today's calendar day in the user's local timezone, ready to send to
 * the API as a YYYY-MM-DD string.
 */
export function todayForBackend(): string {
  return toBackendDate(new Date());
}

/**
 * Parse a YYYY-MM-DD calendar-day string from the API into a Date set to
 * midnight LOCAL time on that day. Use only for display or for passing to
 * date-fns formatting — do NOT compare it to other Dates as a moment.
 */
export function parseBackendDate(s: string): Date {
  return parseISO(s);
}

/**
 * Format a calendar-day Date for display. No time component is shown.
 *
 * @param fmt date-fns format string. Defaults to localized "May 28, 2026"
 */
export function formatDateForUser(date: Date, fmt: string = "PP"): string {
  return format(date, fmt);
}
