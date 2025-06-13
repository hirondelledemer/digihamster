import { Habit } from "#src/models/habit.js";
import { now } from "#utils/date";
import { subDays } from "date-fns";

export const getHabitProgress = (habit: Habit) => {
  const earliestDay = subDays(now(), 28).getTime();

  const progress = habit.log.filter(
    (log) => log.at >= earliestDay && log.completed
  ).length;
  const habitProgress = (progress / habit.timesPerMonth) * 100;

  return Math.max(Math.min(habitProgress, 100), 1);
};
