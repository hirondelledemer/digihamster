import { Habit } from "@/models/habit";

export const generateHabit: (
  i?: number,
  properties?: Partial<Habit>
) => Habit = (i = 1, properties) => {
  return {
    _id: `habit${i}`,
    title: `Habit ${i}`,
    category: `home`,
    deleted: false,
    log: [],
    timesPerMonth: 4,
    updatedAt: "",
    ...properties,
  };
};

export const generateListOfHabits: (count: number) => Habit[] = (count) => {
  return [...Array(count)].map((_v, i) => generateHabit(i));
};

export const generateCustomHabitList: (
  habitInfo: Partial<Habit>[]
) => Habit[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateHabit(i, taskProperties),
  }));
};
