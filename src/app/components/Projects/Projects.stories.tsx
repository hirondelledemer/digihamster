import type { Meta, StoryObj } from "@storybook/react";

import Projects from ".";
import { ProjectsProps } from "./Projects";
import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { ProjectsStateContext } from "@/app/utils/hooks/use-projects/state-context";
import { generateCustomProjectsList } from "@/app/utils/mocks/project";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { subDays } from "date-fns";
import { now } from "@/app/utils/date/date.mock";

const PROJECTS = generateCustomProjectsList([
  { title: "active projects with not completed tasks" },
  { title: "active with completed tasks" },
  { title: "disabled project with tasks", disabled: true },
  { title: "disabled project with completed tasks", disabled: true },
]);

const TODAY_DATE = new Date("2024-02-14");

const meta: Meta<typeof Projects> = {
  title: "Example/Projects",
  component: Projects,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ProjectsStateContext.Provider
        value={{
          isLoading: false,
          data: PROJECTS,
          defaultProject: PROJECTS[0],
          getProjectById: (id) => PROJECTS.find((p) => p._id === id) || null,
        }}
      >
        <TasksContext.Provider
          value={{
            data: generateCustomTasksList([
              {
                projectId: PROJECTS[0]._id,
                completed: true,
                createdAt: subDays(TODAY_DATE, 15).toString(),
                completedAt: subDays(TODAY_DATE, 10).getTime(),
                estimate: 1,
              },
              {
                createdAt: subDays(TODAY_DATE, 14).toString(),
                projectId: PROJECTS[0]._id,
              },
              {
                createdAt: subDays(TODAY_DATE, 13).toString(),
                projectId: PROJECTS[0]._id,
              },
              {
                projectId: PROJECTS[1]._id,
                completed: true,
              },
              {
                projectId: PROJECTS[1]._id,
                completed: true,
              },
              {
                projectId: PROJECTS[2]._id,
              },
              {
                projectId: PROJECTS[3]._id,
                completed: true,
              },
              {
                projectId: PROJECTS[3]._id,
                completed: true,
              },
            ]),
            loading: false,
            setData: () => {},
          }}
        >
          <Story />
        </TasksContext.Provider>
      </ProjectsStateContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Projects>;

const defaultArgs: ProjectsProps = {};

export const Default: Story = {
  async beforeEach() {
    now.mockReturnValue(TODAY_DATE);
  },

  args: defaultArgs,
};
