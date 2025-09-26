import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@/config/utils/test-utils";
import ProjectForm, { ProjectFormProps, rteTestId } from "./ProjectForm";

import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";

describe("ProjectForm", () => {
  const defaultProps: ProjectFormProps = {
    editMode: false,
    initialValues: {},
    onDone: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    render(
      <ProjectsContextProvider>
        <LifeAspectsContextProvider>
          <ProjectForm {...props} />{" "}
        </LifeAspectsContextProvider>
      </ProjectsContextProvider>
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should create project", async () => {
    renderComponent();

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      expect(
        screen.getByRole("textbox", {
          name: /title/i,
        })
      ).toBeInTheDocument();
      await userEvent.type(
        screen.getByRole("textbox", {
          name: /title/i,
        }),
        "Title"
      );

      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue("<p>description</p>");
      rteWrapper.blur();
      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/projects", {
          color: "#e11d48",
          disabled: false,
          category: "",
          jsonDescription: {
            content: [
              {
                content: [
                  {
                    text: "description",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          title: "Title",
        });
      });
    });
  });
});
