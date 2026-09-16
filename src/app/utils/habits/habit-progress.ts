import { isAfter, subDays } from "date-fns";
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
