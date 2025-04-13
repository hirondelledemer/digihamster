import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import ProjectModalForm, { ProjectModalFormProps } from "./ProjectModalForm";
import { rteTestId } from "../ProjectForm/ProjectForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import mockAxios from "jest-mock-axios";

describe("ProjectModalForm", () => {
  const defaultProps: ProjectModalFormProps = {
    open: true,
    onClose: jest.fn(),
    editMode: false,
    onDone: jest.fn(),
  };

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(<ProjectModalForm {...props} />);

  it("should create project", async () => {
    renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", {
        name: /title/i,
      }),
      "Title"
    );
    await userEvent.click(
      screen.getByRole("combobox", {
        name: /color/i,
      })
    );

    screen.logTestingPlaygroundURL();
    await userEvent.click(screen.getByRole("option", { name: /#c084fc/i }));

    // const rte = screen.getByTestId(rteTestId);
    // const rteWrapper = getRichTextEditorTestkit(rte);

    // rteWrapper.enterValue("<p>description</p>");
    // rteWrapper.blur();
    // await userEvent.click(screen.getByRole("button", { name: /create/i }));
    // await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/projects", {});
    });
  });
});
