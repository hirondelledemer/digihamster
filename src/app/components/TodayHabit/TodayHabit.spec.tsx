import { render } from "@testing-library/react";
import TodayHabit, { TodayHabitProps } from "./TodayHabit";
import { getTodayHabitTestkit } from "./TodayHabit.testkit";
import { now } from "@/app/utils/date/date";

describe("TodayHabit", () => {
  const defaultProps: TodayHabitProps = {
    habit: {
      _id: "habit1",
      title: "Habit 1",
      deleted: false,
      log: [],
      category: "",
      timesPerMonth: 2,
      updatedAt: "",
    },
    date: now(),
    percentage: 1,
  };
  const renderComponent = (props = defaultProps) =>
    getTodayHabitTestkit(render(<TodayHabit {...props} />).container);

  it("should render TodayHabit", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
