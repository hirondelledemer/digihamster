import { render } from "@testing-library/react";
import ProjectForm, { ProjectFormProps } from "./ProjectForm";
import { getProjectFormTestkit } from "./ProjectForm.testkit";

describe("ProjectForm", () => {
  const defaultProps: ProjectFormProps = {
    editMode: false,
    initialValues: {},
    onDone: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    getProjectFormTestkit(render(<ProjectForm {...props} />).container);

  it("should render ProjectForm", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
