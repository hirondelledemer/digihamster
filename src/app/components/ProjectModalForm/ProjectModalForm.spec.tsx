import { render } from "@testing-library/react";
import ProjectModalForm, { ProjectModalFormProps } from "./ProjectModalForm";
import { getProjectModalFormTestkit } from "./ProjectModalForm.testkit";

describe("ProjectModalForm", () => {
  const defaultProps: ProjectModalFormProps = {
    open: true,
    onClose: jest.fn(),
    editMode: false,
    onDone: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    getProjectModalFormTestkit(
      render(<ProjectModalForm {...props} />).container
    );

  it("should render ProjectModalForm", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
