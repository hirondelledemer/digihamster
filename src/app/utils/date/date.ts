import { subDays } from "date-fns";

export const now = () => new Date();

export const getToday = () => {
  const today = now();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getTimestampsFrom = (startingDate: Date, howMany: number) => {
  let array = [];
  for (let i = 0; i <= howMany; i++) {
    array.push(subDays(startingDate, i).getTime());
  }
  return array.reverse();
};
