import { Habit } from "#src/models/habit";
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

export const getHabitProgressForCategory = (
  habits: Habit[],
  category: string | string[]
) => {
  const categories = Array.isArray(category) ? category : [category];
  const earliestDay = subDays(now(), 28).getTime();
  const habitsForCategory = habits.filter((h) =>
    categories.includes(h.category)
  );

  const total = habitsForCategory.reduce((prev, curr) => {
    return curr.timesPerMonth + prev;
  }, 0);

  const progress = habitsForCategory.reduce((curr, prev) => {
    return (
      prev.log.filter((log) => log.at >= earliestDay && log.completed).length +
      curr
    );
  }, 0);

  const progressPercentage = Math.min((progress / total) * 100, 100);

  return progressPercentage;
};
