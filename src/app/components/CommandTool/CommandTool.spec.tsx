import { act } from "react";
import CommandTool, { CommandToolProps } from "./CommandTool";
import { getCommandToolTestkit } from "./CommandTool.testkit";
import mockAxios from "jest-mock-axios";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import { rteTestId } from "../CreateTaskForm/CreateTaskForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { generateListOfProjects } from "@/app/utils/mocks/project";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("CommandTool", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: CommandToolProps = {};
  const renderComponent = (props = defaultProps) =>
    getCommandToolTestkit(
      render(
        wrapWithTasksProvider(
          <ProjectsContextProvider>
            <CommandTool {...props} />
          </ProjectsContextProvider>,
          { data: [] }
        )
      ).container
    );

  it("should render CommandTool", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });

  describe("go-to actions", () => {
    it("should to tasks page", async () => {
      const pushMock = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
      useRouter.mockImplementation(() => ({
        push: pushMock,
      }));

      const { pressCmdK, commandToolOpen, clickGoToTasks } = renderComponent();
      await act(async () => {
        pressCmdK();
      });
      expect(commandToolOpen()).toBe(true);

      clickGoToTasks();

      expect(pushMock).toHaveBeenCalledWith("/tasks");
    });

    it("should to home page", async () => {
      const pushMock = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
      useRouter.mockImplementation(() => ({
        push: pushMock,
      }));

      const { pressCmdK, commandToolOpen, clickGoToHome } = renderComponent();
      await act(async () => {
        pressCmdK();
      });
      expect(commandToolOpen()).toBe(true);

      clickGoToHome();

      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  describe("create task actions", () => {
    it("should create task", async () => {
      const mockData = {
        projects: generateListOfProjects(3),
        defaultProject: generateListOfProjects(3)[1],
      };
      mockAxios.get.mockResolvedValue({ data: mockData });

      const { pressCmdK, commandToolOpen, clickCreateTask } = renderComponent();

      act(() => {
        pressCmdK();
      });
      expect(commandToolOpen()).toBe(true);

      act(() => {
        clickCreateTask();
      });

      expect(
        screen.getByRole("heading", { name: /create task/i })
      ).toBeInTheDocument();

      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);
      rteWrapper.enterValue("<p>new task title</p><p>new desc</p>");
      rteWrapper.blur();

      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          description: "new desc",
          descriptionFull: {
            content: [
              {
                content: [
                  {
                    text: "new task title",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
              {
                content: [
                  {
                    text: "new desc",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          isActive: false,
          projectId: "project1",
          subtasks: [],
          tags: [],
          title: "new task title",
        });
      });
    });

    it("should add quick task", async () => {
      const {
        pressCmdK,
        commandToolOpen,
        enterSearch,
        getCreateQuickTaskExists,
        getCreateActiveTaskExists,
        getCreateTaskExists,
        clickAddQuickTask,
      } = renderComponent();
      act(() => {
        pressCmdK();
      });
      expect(commandToolOpen()).toBe(true);

      act(() => {
        enterSearch("new task title");
      });
      expect(getCreateQuickTaskExists()).toBe(true);
      expect(getCreateActiveTaskExists()).toBe(false);
      expect(getCreateTaskExists()).toBe(false);
      act(() => {
        clickAddQuickTask();
      });

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          isActive: true,
          projectId: "",
          title: "new task title",
          tags: [],
          subtasks: [],
        });
      });
    });
  });
});
