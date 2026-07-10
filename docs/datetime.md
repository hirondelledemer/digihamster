# Client date/time conventions

Keep this file next to `datetime.ts` in your client app (`lib/datetime.ts`

- `lib/datetime.md`, or wherever you prefer). Anyone touching dates should
  read this first.

## Two kinds of date fields

The API has two kinds of date/time fields. Treat them differently — they
look similar but mean different things.

| Kind             | What it means                                             | API examples                                       | Wire format              |
| ---------------- | --------------------------------------------------------- | -------------------------------------------------- | ------------------------ |
| **Instant**      | A specific moment in time. Has a clock. UTC on the wire.  | `event.start_at`, `event.end_at`, any `created_at` | `"2026-05-28T13:00:00Z"` |
| **Calendar day** | A day the user assigns meaning to. No clock. No timezone. | `habit_log.log_date`                               | `"2026-05-28"`           |

Rule of thumb: _"If the user flies to Tokyo, does the date change meaning?"_

- Yes → instant. Use the instant helpers.
- No → calendar day. Use the calendar-day helpers.

## Helpers — `datetime.ts`

```ts
import {
  toBackendDateTime,
  parseBackendDateTime,
  formatDateTimeForUser,
  toBackendDate,
  parseBackendDate,
  formatDateForUser,
  todayForBackend,
} from "@/lib/datetime";
```

### Instants

```ts
// Sending: user picked May 28, 3pm in a date/time picker
const pick = new Date(2026, 4, 28, 15, 0);
await api.patch(`/events/${id}`, {
  start_at: toBackendDateTime(pick), // → "2026-05-28T12:00:00.000Z" if UTC+3
});

// Receiving and displaying
const d = parseBackendDateTime(event.start_at);
formatDateTimeForUser(d); // → "May 28, 2026, 3:00 PM" (user's TZ)
formatDateTimeForUser(d, "HH:mm"); // → "15:00"
```

### Calendar days

```ts
// Today, in the user's local timezone
await api.post(`/habits/${id}/logs`, {
  log_date: todayForBackend(), // → "2026-05-28"
  completed: true,
});

// Or a specific day from a picker
await api.post(`/habits/${id}/logs`, {
  log_date: toBackendDate(pickedDate),
  completed: true,
});

// Displaying
const d = parseBackendDate(log.log_date);
formatDateForUser(d); // → "May 28, 2026"
```

## Anti-patterns — don't do these

```ts
// ❌ UTC date — wrong day for users east/west of UTC near midnight
new Date().toISOString().slice(0, 10);

// ❌ Naive timestamp with no timezone — ambiguous
fetch("/events", { body: JSON.stringify({ start_at: "2026-05-28T15:00:00" }) });

// ❌ Manual offset math — Date already knows the user's TZ
new Date(event.start_at).getTime() - userOffsetMinutes * 60_000;

// ❌ String slicing a timestamp to extract parts
event.start_at.slice(11, 16);
```

## Why we have these rules

We had a bug where habit logs were stamped at "1 AM" of each day. When DST
hit, 1 AM didn't exist on spring-forward day and existed twice on
fall-back day — habit logs disappeared and duplicated. The fix was to stop
treating "did I do it today?" as a timestamp and start treating it as a
calendar day.

Events go the other direction: they _are_ moments in time (meetings happen
at one specific instant), so we store and transmit them as UTC ISO 8601
and let `Date` do the timezone conversion at the display layer.

The helpers in `datetime.ts` encode these rules so you can't mess them up
by accident. Use them; don't roll your own.
