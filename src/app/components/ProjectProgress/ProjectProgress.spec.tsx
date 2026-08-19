import { act, render, screen, waitFor } from "@/config/utils/test-utils";
import ProjectProgress from "./ProjectProgress";
import mockAxios from "jest-mock-axios";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { DAY } from "@/app/utils/consts/dates";
import { generateProject } from "@/app/utils/mocks/project";
import { ProjectStatus } from "@/app/utils/types/project";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TaskStatus } from "@/app/utils/types/task";
import { toBackendDate } from "#utils/date";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";

jest.mock("../../utils/date/now");
jest.mock("next/navigation");

const PROJECT = generateProject(1, { status: ProjectStatus.Doing });

const TASKS = generateCustomTasksList([
  {
    status: TaskStatus.Done,
    completed_at: toBackendDate(new Date(0 - DAY)),
    project_id: PROJECT.id,
  },
  {
    status: TaskStatus.Done,
    completed_at: toBackendDate(new Date(0 - DAY)),
    project_id: PROJECT.id,
  },
  {
    status: TaskStatus.Done,
    completed_at: toBackendDate(new Date(0 - DAY * 3)),
    project_id: PROJECT.id,
  },
  {
    status: TaskStatus.Doing,
    project_id: PROJECT.id,
  },
  {
    status: TaskStatus.Todo,
    project_id: PROJECT.id,
  },
  {
    status: TaskStatus.Todo,
    project_id: PROJECT.id,
  },
]);

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));
  await act(async () => {
    mockAxios.mockResponseFor({ url: PROJECTS_PATH }, { data: [PROJECT] });
    mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: TASKS });
  });
};

describe("ProjectProgress", () => {
  const renderComponent = () =>
    render(
      <TasksNewContextProvider>
        <ProjectsContextProvider>
          <ProjectProgress project={PROJECT} />
        </ProjectsContextProvider>
      </TasksNewContextProvider>,
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should render DailyProgress", async () => {
    renderComponent();

    await assertLoaded();

    const bar = screen.getByTestId("progress-bar");

    expect(bar).toMatchSnapshot();
  });
});
