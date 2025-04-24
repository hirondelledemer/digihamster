import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import TaskInfo, { TaskInfoProps } from "./TaskInfo";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { rteTestId } from "../CreateTaskForm/CreateTaskForm";
import mockAxios from "jest-mock-axios";

const routerPushSpy = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: () => ({
    get: () => "task0",
  }),
  useRouter: () => ({
    replace: jest.fn(),
    push: routerPushSpy,
  }),
}));

describe("TaskInfo", () => {
  const defaultProps: TaskInfoProps = {};
  const defaultTasks = generateCustomTasksList([
    { _id: "task0", relatedTaskIds: ["task1", "task2"] },
    { _id: "task1", relatedTaskIds: ["task0", "task2"] },
    { _id: "task2" },
  ]);

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      wrapWithTasksProvider(<TaskInfo {...props} />, { data: defaultTasks })
    );

  it("should render TaskInfo", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: defaultTasks[0].title })
    ).toBeInTheDocument();

    expect(screen.getByText(defaultTasks[1].title)).toBeInTheDocument();
    expect(screen.getByText(defaultTasks[2].title)).toBeInTheDocument();
    expect(screen.getByTestId(rteTestId)).toBeInTheDocument();
  });

  it("should open next task", async () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: defaultTasks[0].title })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("task-info-icon"));

    expect(routerPushSpy).toHaveBeenCalledWith("/?taskId=task1", undefined);
  });

  it("should create the task with the primary task", async () => {
    renderComponent();
    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue("<p>test</p><p>note</p>");
    rteWrapper.blur();

    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/tasks/v2", {
        description: `note`,
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
        projectId: null,
        subtasks: [],
        tags: [],
        deadline: undefined,
        primaryTaskId: "task0",
        title: "test",
      });
    });
  });
});
