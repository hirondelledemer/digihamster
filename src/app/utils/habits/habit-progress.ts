import { addDays, isAfter, isSameDay, subDays } from "date-fns";
import { now } from "../date/now";
import { ILifeAspect } from "../types/life-aspect";
import { IHabitWithLogs } from "../types/habit";

export const getHabitProgress = (habit: IHabitWithLogs) => {
  const earliestDay = subDays(now(), 28).getTime();

  const progress = habit.logs.filter(
    (log) => new Date(log.log_date).valueOf() >= earliestDay && log.completed,
  ).length;
  const habitProgress = (progress / habit.times_per_month) * 100;

  return Math.max(Math.min(habitProgress, 100), 1);
};

export const getHabitProgressForLifeAspect = (
  habits: IHabitWithLogs[],
  lifeAspect: ILifeAspect | ILifeAspect[],
  addBoosts: boolean = false,
) => {
  const lifeAspects = Array.isArray(lifeAspect) ? lifeAspect : [lifeAspect];
  const earliestDay = subDays(now(), 28).getTime();
  const habitsForLifeAspect = habits.filter((h) =>
    lifeAspects
      .map((la) => la.id.toString())
      .includes(h.life_aspect_id.toString()),
  );

  const total = habitsForLifeAspect.reduce((prev, curr) => {
    return curr.times_per_month + prev;
  }, 0);

  const progress = habitsForLifeAspect.reduce((curr, prev) => {
    return (
      prev.logs.filter(
        (log) =>
          new Date(log.log_date).valueOf() >= earliestDay && log.completed,
      ).length + curr
    );
  }, 0);

  const progressPercentage =
    total > 0 ? Math.min((progress / total) * 100, 100) : 0;

  if (!addBoosts) {
    return progressPercentage;
  }

  const boostsValue = lifeAspects
    .map((la) => la.boosts)
    .flat()
    .map((boost) => boost.value)
    .reduce((prev, acc) => prev + acc, 0);

  return Math.min(progressPercentage + boostsValue, 100);
};

/** @deprecated */
export const hasActiveBoosts = (aspect: ILifeAspect) => {
  return !!aspect.boosts.filter((boost) => isAfter(boost.expires, now()))
    .length;
};

/**
 * How a habit is doing, split into the parts that mean different things.
 *
 * A single percentage conflates two questions: "have I done it" and "am I
 * going to be fine". 15% with three sessions already in the calendar is calm;
 * 15% with an empty calendar is the thing worth reacting to. Same 15%.
 *
 * So nothing you have merely planned is ever counted as done - `done` only
 * ever moves when a log says completed. The plan is reported next to it as
 * `committed`, and `gap` is what neither covers. `gap` is the number to show
 * in a warning colour.
 */
export type HabitStatus =
  /** target already met inside the window */
  | "on_track"
  /** not met yet, but what is scheduled covers the rest */
  | "covered"
  /** something is scheduled, still not enough to reach the target */
  | "at_risk"
  /** behind, and nothing in the calendar to fix it */
  | "drifting";

export interface HabitWindow {
  target: number;
  done: number;
  committed: number;
  gap: number;
  donePercent: number;
  coveredPercent: number;
  status: HabitStatus;
}

export interface HabitWindowOptions {
  habit: IHabitWithLogs;
  /** start_at of the occurrences already in the calendar for this habit */
  scheduled?: Date[];
  at?: Date;
  lookBackDays?: number;
  lookAheadDays?: number;
}

export const getHabitWindow = ({
  habit,
  scheduled = [],
  at = now(),
  lookBackDays = 28,
  lookAheadDays = 7,
}: HabitWindowOptions): HabitWindow => {
  const windowStart = subDays(at, lookBackDays).getTime();
  const horizon = addDays(at, lookAheadDays).getTime();
  const target = habit.times_per_month;

  const completedDays = habit.logs
    .filter((log) => log.completed)
    .map((log) => new Date(log.log_date).valueOf());

  const done = completedDays.filter(
    (day) => day >= windowStart && day <= at.getTime()
  ).length;

  // Only what is still ahead counts as a commitment, and only once - an
  // occurrence that has already been ticked off is part of `done`.
  const committed = scheduled.filter((date) => {
    const time = date.valueOf();
    if (time <= at.getTime() || time > horizon) {
      return false;
    }
    return !completedDays.some((day) => isSameDay(day, time));
  }).length;

  const gap = Math.max(0, target - done - committed);

  const percent = (value: number) =>
    target > 0 ? Math.min((value / target) * 100, 100) : 0;

  const status: HabitStatus =
    done >= target
      ? "on_track"
      : gap === 0
        ? "covered"
        : committed > 0
          ? "at_risk"
          : "drifting";

  return {
    target,
    done,
    committed,
    gap,
    donePercent: percent(done),
    coveredPercent: percent(done + committed),
    status,
  };
};
