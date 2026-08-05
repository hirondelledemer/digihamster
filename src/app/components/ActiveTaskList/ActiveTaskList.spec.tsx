import ActiveTaskList from "./ActiveTaskList";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { render, screen, waitFor } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { TaskStatus } from "@/app/utils/types/task";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";

jest.mock("next/navigation");

const TASKS = generateCustomTasksList([
  { status: TaskStatus.Doing },
  { status: TaskStatus.Doing },
  { status: TaskStatus.Doing },
  { status: TaskStatus.Todo },
  { status: TaskStatus.Doing, deadline: DEFAULT_TEST_DATE },
  { status: TaskStatus.Done, deadline: DEFAULT_TEST_DATE },
]);

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));

  mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: TASKS });
};

describe("ActiveTaskList", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = () =>
    render(
      <TasksNewContextProvider>
        <ActiveTaskList />
      </TasksNewContextProvider>,
    );

  it("renders active tasks and tasks without deadline", async () => {
    renderComponent();

    await assertLoaded();

    await expect(
      screen.findByText(TASKS[0].title),
    ).resolves.toBeInTheDocument();
    expect(screen.getByText(TASKS[1].title)).toBeInTheDocument();
    expect(screen.getByText(TASKS[2].title)).toBeInTheDocument();
    expect(screen.queryByText(TASKS[3].title)).not.toBeInTheDocument();
    expect(screen.queryByText(TASKS[4].title)).not.toBeInTheDocument();
    expect(screen.queryByText(TASKS[5].title)).not.toBeInTheDocument();
  });
});
