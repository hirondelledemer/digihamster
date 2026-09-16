import { toBackendDate } from "#utils/date";
import { IHabitWithLogs } from "../types/habit";

export const getHabitLogForADay = (habit: IHabitWithLogs, date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  const log = habit.logs.find(
    (log) => log.log_date.slice(0, 10) === toBackendDate(newDate)
  );

  return log;
};

export const getHabitLogDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  return newDate.valueOf();
};
