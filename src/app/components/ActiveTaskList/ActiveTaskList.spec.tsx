import { ActiveTaskList } from "./ActiveTaskList";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { act, render, screen, waitFor } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";
import { TasksContextProvider } from "@/app/utils/hooks/use-tasks/provider";
import { TaskStatus } from "@/app/utils/types/task";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks/api";
import { DndContext } from "@dnd-kit/core";
import { TooltipProvider } from "../ui/tooltip";

jest.mock("next/navigation");
jest.mock("../../utils/date/now");

const TASKS = generateCustomTasksList([
  { status: TaskStatus.Doing },
  { status: TaskStatus.Doing },
  { status: TaskStatus.Doing },
  { status: TaskStatus.Todo },
  { status: TaskStatus.Doing, deadline: DEFAULT_TEST_DATE },
  { status: TaskStatus.Done, deadline: DEFAULT_TEST_DATE },
  { status: TaskStatus.Doing, event_id: 1 },
]);

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));

  await act(async () => {
    mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: TASKS });
  });
};

describe("ActiveTaskList", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = () =>
    render(
      <TooltipProvider>
        <TasksContextProvider>
          <DndContext>
            <ActiveTaskList />
          </DndContext>
        </TasksContextProvider>
      </TooltipProvider>
    );

  it("shows the active tasks that are not scheduled anywhere", async () => {
    renderComponent();

    await assertLoaded();

    expect(screen.getByText(TASKS[0].title)).toBeInTheDocument();
    expect(screen.getByText(TASKS[1].title)).toBeInTheDocument();
    expect(screen.getByText(TASKS[2].title)).toBeInTheDocument();
    expect(screen.queryByText(TASKS[3].title)).not.toBeInTheDocument();
    expect(screen.queryByText(TASKS[4].title)).not.toBeInTheDocument();
    expect(screen.queryByText(TASKS[5].title)).not.toBeInTheDocument();
    expect(screen.queryByText(TASKS[6].title)).not.toBeInTheDocument();
  });
});
