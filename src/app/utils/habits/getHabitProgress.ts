import { Habit } from "@/models/habit";
import { LifeAspect } from "@/models/life-aspect.js";
import { now } from "#utils/date";
import { isAfter, subDays } from "date-fns";

export const getHabitProgress = (habit: Habit) => {
  const earliestDay = subDays(now(), 28).getTime();

  const progress = habit.logs.filter(
    (log) => new Date(log.log_date).valueOf() >= earliestDay && log.completed,
  ).length;
  const habitProgress = (progress / habit.times_per_month) * 100;

  return Math.max(Math.min(habitProgress, 100), 1);
};

export const getHabitProgressForLifeAspect = (
  habits: Habit[],
  lifeAspect: LifeAspect | LifeAspect[],
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
    .filter((boost) => isAfter(boost.expires, now()))
    .map((boost) => boost.value)
    .reduce((prev, acc) => prev + acc, 0);

  return Math.min(progressPercentage + boostsValue, 100);
};

export const hasActiveBoosts = (aspect: LifeAspect) => {
  return !!aspect.boosts.filter((boost) => isAfter(boost.expires, now()))
    .length;
};
