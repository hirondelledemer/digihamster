import React, { FC } from "react";
import { HabitStatus, HabitWindow } from "@/app/utils/habits/habit-progress";

export const progressTestId = "HabitProgress-testid";

/**
 * Done, committed and gap in one bar.
 *
 * The solid part is what actually happened; the striped part is only
 * scheduled. Keeping them visually distinct is the whole point - a habit that
 * reads 25% with the rest of the bar striped needs no reaction, and the same
 * 25% with the rest left empty does.
 */
const STATUS_LABEL: { [key in HabitStatus]: string } = {
  on_track: "on track",
  covered: "covered by your plan",
  at_risk: "short even with what is planned",
  drifting: "nothing scheduled",
};

/** only the case with no plan behind it is worth an alarming colour */
const STATUS_TEXT: { [key in HabitStatus]: string } = {
  on_track: "text-muted-foreground",
  covered: "text-muted-foreground",
  at_risk: "text-muted-foreground",
  drifting: "text-destructive",
};

export interface HabitProgressProps {
  habitWindow: HabitWindow;
}

export const HabitProgress: FC<HabitProgressProps> = ({ habitWindow }) => {
  const { done, committed, target, donePercent, coveredPercent, status } =
    habitWindow;

  return (
    <div className="flex flex-col gap-1" data-testid={progressTestId}>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
        {/* scheduled sits underneath, so the solid part always wins the overlap */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
          style={{
            width: `${coveredPercent}%`,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 3px, hsl(var(--primary)/0.35) 3px 6px)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: `${donePercent}%` }}
        />
      </div>
      <div
        className={`flex justify-between text-[10px] leading-none ${STATUS_TEXT[status]}`}
      >
        <span>
          {done}/{target}
          {committed > 0 && ` · ${committed} scheduled`}
        </span>
        <span>{STATUS_LABEL[status]}</span>
      </div>
    </div>
  );
};
