import { IHabitWithLogs } from "../types/habit";
import { DEFAULT_TEST_DATE } from "./date";

export const generateHabit: (
  i?: number,
  properties?: Partial<IHabitWithLogs>
) => IHabitWithLogs = (i = 1, properties) => {
  return {
    id: i,
    title: `Habit ${i}`,
    life_aspect_id: 1,
    deleted: false,
    logs: [],
    times_per_month: 4,
    description: `Habit desc ${i}`,
    created_at: DEFAULT_TEST_DATE,
    ...properties,
  };
};

export const generateListOfHabits: (count: number) => IHabitWithLogs[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateHabit(i));
};

export const generateCustomHabitList: (
  habitInfo: Partial<IHabitWithLogs>[]
) => IHabitWithLogs[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateHabit(i, taskProperties),
  }));
};
