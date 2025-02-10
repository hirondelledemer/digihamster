import { render } from "@testing-library/react";
import ProjectModal, { ProjectModalProps } from "./ProjectModal";
import { getProjectModalTestkit } from "./ProjectModal.testkit";

describe("ProjectModal", () => {
  const defaultProps: ProjectModalProps = {
    open: true,
    onClose: jest.fn(),
    children: "",
  };
  const renderComponent = (props = defaultProps) =>
    getProjectModalTestkit(render(<ProjectModal {...props} />).container);

  it("should render ProjectModal", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
