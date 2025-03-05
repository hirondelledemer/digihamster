import { render } from "@testing-library/react";
import HabitFormModal, { HabitFormModalProps } from "./HabitFormModal";
import { getHabitFormModalTestkit } from "./HabitFormModal.testkit";
import { HabitFormProps } from "../HabitForm/HabitForm";

describe("HabitFormModal", () => {
  const defaultProps: HabitFormModalProps & HabitFormProps = {
    open: false,
    onClose: jest.fn(),

    editMode: false,
    onDone: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    getHabitFormModalTestkit(render(<HabitFormModal {...props} />).container);

  it("should render HabitFormModal", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
