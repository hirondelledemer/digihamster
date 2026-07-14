import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import TaskInfo, { TaskInfoProps } from "./TaskInfo";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { rteTestId } from "../CreateTaskForm/CreateTaskForm";
import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { generateListOfProjects } from "@/app/utils/mocks/project";
import { useSearchParams } from "next/navigation";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { TaskStatus } from "@/app/utils/types/task";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";

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

  const SELECTED_PROJECT = DEFAULT_PROJECTS[1];

  const DEFAULT_TASKS = generateCustomTasksList([
    { project_id: SELECTED_PROJECT.id },
    { project_id: SELECTED_PROJECT.id },
    { project_id: SELECTED_PROJECT.id },
  ]);

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      <TasksNewContextProvider>
        <ProjectsContextProvider>
          <TaskInfo {...props} />
        </ProjectsContextProvider>
      </TasksNewContextProvider>,
    );

  describe("projectId is present in the query params", () => {
    it("should render TaskInfo", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => String(SELECTED_PROJECT.id),
      });
      renderComponent();

      // Wait until both useEffect requests are queued, then respond by URL.
      // mockResponseFor matches on criteria (not order), so this is
      // independent of which request fired first.
      await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));

      mockAxios.mockResponseFor(
        { url: PROJECTS_PATH },
        { data: DEFAULT_PROJECTS },
      );
      mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: DEFAULT_TASKS });

      await expect(
        screen.findByRole("heading", { name: SELECTED_PROJECT.title }),
      ).resolves.toBeInTheDocument();

      expect(screen.getByText(DEFAULT_TASKS[0].title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_TASKS[1].title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_TASKS[2].title)).toBeInTheDocument();
      expect(screen.getByTestId(rteTestId)).toBeInTheDocument();
    });

    it("should create task for the project", async () => {
      (useSearchParams as jest.Mock).mockReturnValue({
        get: () => String(SELECTED_PROJECT.id),
      });
      renderComponent();

      // Wait until both useEffect requests are queued, then respond by URL.
      // mockResponseFor matches on criteria (not order), so this is
      // independent of which request fired first.
      await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));

      mockAxios.mockResponseFor(
        { url: PROJECTS_PATH },
        { data: DEFAULT_PROJECTS },
      );
      mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: DEFAULT_TASKS });

      await expect(
        screen.findByRole("heading", { name: SELECTED_PROJECT.title }),
      ).resolves.toBeInTheDocument();

      const rte = await screen.findByTestId(rteTestId);
      const rteWrapper = getRichTextEditorTestkit(rte);

      rteWrapper.enterValue("<p>test</p><p>note</p>");
      rteWrapper.blur();

      await userEvent.click(screen.getByRole("button", { name: /create/i }));

      expect(mockAxios.post).toHaveBeenCalledWith(TASKS_PATH, {
        deadline: null,
        description: "note",
        project_id: SELECTED_PROJECT.id,
        status: TaskStatus.Todo,
        title: "test",
      });
    });
  });
});
