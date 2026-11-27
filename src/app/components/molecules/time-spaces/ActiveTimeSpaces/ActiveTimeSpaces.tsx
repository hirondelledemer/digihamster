"use client";

import { differenceInCalendarDays } from "date-fns";
import { FC } from "react";

import { parseBackendDate } from "@/utils/date";
import { useCalendarDate } from "@/app/utils/hooks/use-calendar-date";
import { useActiveTimeSpaces } from "@/app/utils/hooks/use-time-spaces/selectors";
import { ITimeSpace, TimeSpaceKind } from "@/app/utils/types/time-space";

import { Badge } from "../../../ui/badge";

export interface ActiveTimeSpacesProps {
  testId?: string;
}

/**
 * "day 2 of 3" - where you are inside a multi-day window. A one-day range has
 * nothing to say (it is always day 1 of 1), and a yearly month is a season
 * rather than something you are counting down.
 */
const describeProgress = (timeSpace: ITimeSpace, date: Date): string | null => {
  if (timeSpace.kind !== TimeSpaceKind.DateRange) {
    return null;
  }

  const start = parseBackendDate(timeSpace.params.start);
  const total =
    differenceInCalendarDays(parseBackendDate(timeSpace.params.end), start) + 1;

  if (total < 2) {
    return null;
  }

  return `day ${differenceInCalendarDays(date, start) + 1} of ${total}`;
};

/**
 * The time spaces the calendar's selected day falls inside. Renders nothing on
 * an ordinary day, so the strip only takes up room when it has something to
 * say.
 */
export const ActiveTimeSpaces: FC<ActiveTimeSpacesProps> = ({ testId }) => {
  const { selectedDate } = useCalendarDate();
  const timeSpaces = useActiveTimeSpaces(selectedDate);

  if (!timeSpaces.length) {
    return null;
  }

  return (
    <div data-testid={testId} className="mb-3 flex flex-wrap items-center gap-2">
      {timeSpaces.map((timeSpace) => {
        const progress = describeProgress(timeSpace, selectedDate);

        return (
          <Badge
            key={timeSpace.id}
            // `custom` tints the badge with the colour; without one there is
            // nothing to tint, and the default variant would shout
            variant={timeSpace.color ? "custom" : "secondary"}
            color={timeSpace.color}
            className="gap-1.5 font-normal"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
              aria-hidden
            />
            <span>{timeSpace.title}</span>
            {progress ? <span className="opacity-60">{progress}</span> : null}
          </Badge>
        );
      })}
    </div>
  );
};
