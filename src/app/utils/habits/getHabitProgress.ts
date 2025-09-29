import { Habit } from "@/models/habit";
import { LifeAspect } from "@/models/life-aspect.js";
import { now } from "#utils/date";
import { isAfter, subDays } from "date-fns";

export const getHabitProgress = (habit: Habit) => {
  const earliestDay = subDays(now(), 28).getTime();

  const progress = habit.log.filter(
    (log) => log.at >= earliestDay && log.completed
  ).length;
  const habitProgress = (progress / habit.timesPerMonth) * 100;

  return Math.max(Math.min(habitProgress, 100), 1);
};

export const getHabitProgressForLifeAspect = (
  habits: Habit[],
  lifeAspect: LifeAspect | LifeAspect[],
  addBoosts: boolean = false
) => {
  const lifeAspects = Array.isArray(lifeAspect) ? lifeAspect : [lifeAspect];
  const earliestDay = subDays(now(), 28).getTime();
  const habitsForLifeAspect = habits.filter((h) =>
    lifeAspects.map((la) => la._id).includes(h.category)
  );

  const total = habitsForLifeAspect.reduce((prev, curr) => {
    return curr.timesPerMonth + prev;
  }, 0);

  const progress = habitsForLifeAspect.reduce((curr, prev) => {
    return (
      prev.log.filter((log) => log.at >= earliestDay && log.completed).length +
      curr
    );
  }, 0);

  const progressPercentage = Math.min((progress / total) * 100, 100);

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
