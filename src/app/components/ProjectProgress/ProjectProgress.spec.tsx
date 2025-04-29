import { render, screen } from "@/config/utils/test-utils";
import ProjectProgress from "./ProjectProgress";
import mockAxios from "jest-mock-axios";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { DAY } from "@/app/utils/consts/dates";
import { generateProject } from "@/app/utils/mocks/project";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";

jest.mock("../../utils/date/date");

describe("ProgressProject", () => {
  const PROJECT = generateProject();

  const renderComponent = () =>
    render(
      wrapWithTasksProvider(
        <ProjectsContextProvider>
          <ProjectProgress />
        </ProjectsContextProvider>,
        {
          data: generateCustomTasksList([
            {
              completed: true,
              completedAt: 0 - DAY,
              projectId: PROJECT._id,
            },
            {
              completed: true,
              completedAt: 0 - DAY,
              projectId: PROJECT._id,
            },
            {
              completed: true,
              completedAt: 0 - DAY * 3,
              projectId: PROJECT._id,
            },
            {
              completed: false,
              isActive: true,
              projectId: PROJECT._id,
            },
            {
              completed: false,
              projectId: PROJECT._id,
            },
            {
              completed: false,
              projectId: PROJECT._id,
            },
          ]),
        }
      )
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should render DailyProgress", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { projects: [PROJECT] } });

    renderComponent();
    const bar = await screen.findByTestId("progress-bar");

    expect(bar).toMatchSnapshot();
  });
});
