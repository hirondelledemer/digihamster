import { render, screen, userEvent } from "@/config/utils/test-utils";
import TaskInfo, { TaskInfoProps } from "./TaskInfo";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";

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
  });

  it("should open next task", async () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: defaultTasks[0].title })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("task-info-icon"));

    expect(routerPushSpy).toHaveBeenCalledWith("/?taskId=task1", undefined);
  });
});
