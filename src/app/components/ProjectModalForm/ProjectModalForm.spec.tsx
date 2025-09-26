import { render, screen } from "@/config/utils/test-utils";
import ProjectModalForm, { ProjectModalFormProps } from "./ProjectModalForm";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";

describe("ProjectModalForm", () => {
  const defaultProps: ProjectModalFormProps = {
    open: true,
    onClose: jest.fn(),
    editMode: false,
    onDone: jest.fn(),
  };

  const renderComponent = (props = defaultProps) =>
    render(
      <LifeAspectsContextProvider>
        <ProjectModalForm {...props} />
      </LifeAspectsContextProvider>
    );

  it("should create project", async () => {
    renderComponent();

    expect(screen.getByText("Project")).toBeInTheDocument();
  });
});
