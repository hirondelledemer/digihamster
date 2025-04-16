import { render, screen } from "@/config/utils/test-utils";
import ProjectModalForm, { ProjectModalFormProps } from "./ProjectModalForm";

describe("ProjectModalForm", () => {
  const defaultProps: ProjectModalFormProps = {
    open: true,
    onClose: jest.fn(),
    editMode: false,
    onDone: jest.fn(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<ProjectModalForm {...props} />);

  it("should create project", async () => {
    renderComponent();

    expect(screen.getByText("Project")).toBeInTheDocument();
  });
});
