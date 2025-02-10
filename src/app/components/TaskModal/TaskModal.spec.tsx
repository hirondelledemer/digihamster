import { render } from "@testing-library/react";
import TaskModal, { TaskModalProps } from "./TaskModal";
import { getTaskModalTestkit } from "./TaskModal.testkit";

describe("TaskModal", () => {
  const defaultProps: TaskModalProps = {
    open: true,
    onClose: jest.fn(),
    children: "children",
  };
  const renderComponent = (props = defaultProps) =>
    getTaskModalTestkit(render(<TaskModal {...props} />).container);

  it("should render TaskModal", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
