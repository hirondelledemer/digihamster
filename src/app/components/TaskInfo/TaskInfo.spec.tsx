import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import TaskInfo, { TaskInfoProps } from "./TaskInfo";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { rteTestId } from "../CreateTaskForm/CreateTaskForm";
import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { generateListOfProjects } from "@/app/utils/mocks/project";
import { useSearchParams } from "next/navigation";

const routerPushSpy = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
    push: routerPushSpy,
  }),
}));

describe("TaskInfo", () => {
  const defaultProps: TaskInfoProps = {};
  const DEFAULT_PROJECTS = generateListOfProjects(3);
  const SELECTED_PROJECT = DEFAULT_PROJECTS[0];
  const DEFAULT_TASKS = generateCustomTasksList([
    {
      _id: "task0",
      relatedTaskIds: ["task1", "task2"],
      projectId: SELECTED_PROJECT._id,
    },
    {
      _id: "task1",
      relatedTaskIds: ["task0", "task2"],
      projectId: SELECTED_PROJECT._id,
    },
    { _id: "task2", projectId: SELECTED_PROJECT._id },
  ]);
  const SELECTED_TASK = DEFAULT_TASKS[0];

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      wrapWithTasksProvider(
        <ProjectsContextProvider>
          <TaskInfo {...props} />
        </ProjectsContextProvider>,
        { data: DEFAULT_TASKS }
      )
    );

  describe("taskId is present in the query params", () => {
    it("should render TaskInfo", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_TASK._id,
      });

      renderComponent();

      await expect(
        screen.findByRole("heading", { name: SELECTED_TASK.title })
      ).resolves.toBeInTheDocument();

      expect(screen.getByText(DEFAULT_TASKS[1].title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_TASKS[2].title)).toBeInTheDocument();
      expect(screen.getByTestId(rteTestId)).toBeInTheDocument();
    });

    it("should open next task", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_TASK._id,
      });

      renderComponent();

      expect(
        screen.getByRole("heading", { name: SELECTED_TASK.title })
      ).toBeInTheDocument();

      await userEvent.click(screen.getByTestId("task-info-icon"));

      expect(routerPushSpy).toHaveBeenCalledWith("/?taskId=task1", undefined);
    });

    it("should create the task with the primary task", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_TASK._id,
      });

      renderComponent();
      const rte = screen.getByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue("<p>test</p><p>note</p>");
      rteWrapper.blur();

      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          description: `note`,
          projectId: "project0",
          descriptionFull: {
            content: [
              {
                content: [
                  {
                    text: "test",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
              {
                content: [
                  {
                    text: "note",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          isActive: false,
          subtasks: [],
          tags: [],
          deadline: undefined,
          primaryTaskId: "task0",
          title: "test",
        });
      });
    });
  });

  describe("projectId is present in the query params", () => {
    it("should render TaskInfo", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_PROJECT._id,
      });
      const mockData = {
        projects: DEFAULT_PROJECTS,
        defaultProject: null,
      };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      renderComponent();

      await expect(
        screen.findByRole("heading", { name: SELECTED_PROJECT.title })
      ).resolves.toBeInTheDocument();

      expect(screen.getByText(DEFAULT_TASKS[1].title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_TASKS[2].title)).toBeInTheDocument();
      expect(screen.getByTestId(rteTestId)).toBeInTheDocument();
    });

    it("should open next task", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_PROJECT._id,
      });
      const mockData = {
        projects: DEFAULT_PROJECTS,
        defaultProject: null,
      };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      renderComponent();

      await expect(
        screen.findByRole("heading", { name: SELECTED_PROJECT.title })
      ).resolves.toBeInTheDocument();

      await userEvent.click(screen.getAllByTestId("task-info-icon")[0]);

      expect(routerPushSpy).toHaveBeenCalledWith("/?taskId=task0", undefined);
    });

    it("should create the task with for the project", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => SELECTED_PROJECT._id,
      });
      const mockData = {
        projects: DEFAULT_PROJECTS,
        defaultProject: null,
      };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      renderComponent();

      const rte = await screen.findByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue("<p>test</p><p>note</p>");
      rteWrapper.blur();

      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
          description: `note`,
          projectId: SELECTED_PROJECT._id,
          descriptionFull: {
            content: [
              {
                content: [
                  {
                    text: "test",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
              {
                content: [
                  {
                    text: "note",
                    type: "text",
                  },
                ],
                type: "paragraph",
              },
            ],
            type: "doc",
          },
          isActive: false,
          subtasks: [],
          tags: [],
          deadline: undefined,
          primaryTaskId: undefined,
          title: "test",
        });
      });
    });
  });
});
