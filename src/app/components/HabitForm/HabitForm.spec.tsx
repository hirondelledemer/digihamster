import { render } from "@testing-library/react";
import HabitForm, { HabitFormProps } from "./HabitForm";
import { getHabitFormTestkit } from "./HabitForm.testkit";

describe("HabitForm", () => {
  const defaultProps: HabitFormProps = {
    editMode: false,
    onDone: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    getHabitFormTestkit(render(<HabitForm {...props} />).container);

  it("should render HabitForm", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
