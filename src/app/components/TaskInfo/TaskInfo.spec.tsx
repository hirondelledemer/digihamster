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
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { cardTestId } from "../TaskCard/TaskCard";

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

    describe("sorting", () => {
      const RANDOMLY_SORTED_TASKS = generateCustomTasksList([
        { status: TaskStatus.Done, project_id: SELECTED_PROJECT.id }, // should be last
        { status: TaskStatus.Todo, project_id: SELECTED_PROJECT.id },
        { status: TaskStatus.Todo, project_id: SELECTED_PROJECT.id },
        { status: TaskStatus.Doing, project_id: SELECTED_PROJECT.id }, // should be on the top
        { event_id: 5, project_id: SELECTED_PROJECT.id }, // should be on the top
        { deadline: DEFAULT_TEST_DATE, project_id: SELECTED_PROJECT.id }, // should be on the top
        { status: TaskStatus.Todo, project_id: SELECTED_PROJECT.id },
        { status: TaskStatus.Todo, project_id: 15 },
      ]);

      it("should sort in the direction: first active and scheduled, then not done, then done", async () => {
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
        mockAxios.mockResponseFor(
          { url: TASKS_PATH },
          { data: RANDOMLY_SORTED_TASKS },
        );

        await expect(
          screen.findByRole("heading", { name: SELECTED_PROJECT.title }),
        ).resolves.toBeInTheDocument();

        const cards = screen.getAllByTestId(cardTestId);

        expect(cards).toHaveLength(7);

        expect(cards[0].textContent).toContain(RANDOMLY_SORTED_TASKS[3].title); // active task
        expect(cards[1].textContent).toContain(RANDOMLY_SORTED_TASKS[4].title); // task with the event
        expect(cards[2].textContent).toContain(RANDOMLY_SORTED_TASKS[5].title); // task with the deadline
        expect(cards[3].textContent).toContain(RANDOMLY_SORTED_TASKS[1].title); // todo task
        expect(cards[4].textContent).toContain(RANDOMLY_SORTED_TASKS[2].title); // todo task
        expect(cards[5].textContent).toContain(RANDOMLY_SORTED_TASKS[6].title); // todo task
        expect(cards[6].textContent).toContain(RANDOMLY_SORTED_TASKS[0].title); // done task
      });
    });
  });
});
