import type { Meta, StoryObj } from "@storybook/react";

import ProjectBurnDownChart from ".";
import { ProjectBurnDownChartProps } from "./ProjectBurnDownChart";
import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { generateProject } from "@/app/utils/mocks/project";
import { subDays } from "date-fns";
import { now } from "@/app/utils/date/date";

const project1 = generateProject(1, { color: "#f59e0b" });

const meta: Meta<typeof ProjectBurnDownChart> = {
  title: "Charts/ProjectBurnDownChart",
  component: ProjectBurnDownChart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TasksContext.Provider
        value={{
          data: generateCustomTasksList([
            {
              projectId: project1._id,
              createdAt: subDays(now(), 10).toString(),
              completedAt: subDays(now(), 8).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 9).toString(),
              completedAt: subDays(now(), 5).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 8).toString(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 7).toString(),
              completedAt: subDays(now(), 3).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 6).toString(),
              completedAt: subDays(now(), 1).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 6).toString(),
              completedAt: subDays(now(), 5).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 4).toString(),
              completedAt: subDays(now(), 1).getTime(),
            },
            {
              projectId: project1._id,
              createdAt: subDays(now(), 1).toString(),
            },
          ]),
          loading: false,
          setData: () => {},
        }}
      >
        <Story />
      </TasksContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProjectBurnDownChart>;

const defaultArgs: ProjectBurnDownChartProps = {
  projectId: project1._id,
};

export const Default: Story = {
  args: defaultArgs,
};
