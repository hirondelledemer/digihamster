import { DEFAULT_TEST_DATE } from "../../mocks/date";

// the mocked clock sits on the same day as DEFAULT_TEST_DATE, so fixtures built
// from the default date are "today" as far as the code under test is concerned
export const now = () => new Date(DEFAULT_TEST_DATE);

export const getTodayWithZeroHours = () => {
  const today = now();
  today.setHours(0, 0, 0, 0);
  return today;
};
