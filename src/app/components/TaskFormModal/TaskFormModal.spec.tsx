import { render } from "@testing-library/react";
import TaskFormModal, { TaskFormModalProps } from "./TaskFormModal";
import { getTaskFormModalTestkit } from "./TaskFormModal.testkit";

describe("TaskFormModal", () => {
  const defaultProps: TaskFormModalProps = {
    open: true,
    onClose: jest.fn(),
    onDone: jest.fn(),
    editMode: false,
  };
  const renderComponent = (props = defaultProps) =>
    getTaskFormModalTestkit(render(<TaskFormModal {...props} />).container);

  it("should render TaskFormModal", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
