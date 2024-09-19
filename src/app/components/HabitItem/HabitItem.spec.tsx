import { render } from "@testing-library/react";
import HabitItem, { HabitItemProps } from "./HabitItem";
import { getHabitItemTestkit } from "./HabitItem.testkit";

describe("HabitItem", () => {
  const defaultProps: HabitItemProps = {
    habit: {
      _id: "habit1",
      title: "Habit 1",
      deleted: false,
      log: [],
      category: "",
      timesPerMonth: 2,
      updatedAt: "",
    },
  };
  const renderComponent = (props = defaultProps) =>
    getHabitItemTestkit(render(<HabitItem {...props} />).container);

  it("should render HabitItem", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
