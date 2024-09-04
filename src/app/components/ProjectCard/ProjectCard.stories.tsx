import type { Meta, StoryObj } from "@storybook/react";

import ProjectCard from ".";
import { ProjectCardProps } from "./ProjectCard";
import { generateProject } from "@/app/utils/mocks/project";
import { TasksContext } from "@/app/utils/hooks/use-tasks";
import { generateCustomTasksList } from "@/app/utils/mocks/task";

const project1 = generateProject(1, { color: "#f59e0b" });
const project2 = generateProject(2, { color: "#f59e0b" });
const meta: Meta<typeof ProjectCard> = {
  title: "Example/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TasksContext.Provider
        value={{
          data: generateCustomTasksList([
            { projectId: project1._id, estimate: 1 },
            { projectId: project1._id, completed: true, estimate: 0.5 },
            { projectId: project1._id },
            { projectId: project2._id, estimate: 1, completed: true },
            { projectId: project2._id, completed: true, estimate: 0.5 },
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
type Story = StoryObj<typeof ProjectCard>;

const defaultArgs: ProjectCardProps = {
  project: project1,
};

export const Default: Story = {
  args: defaultArgs,
};

const completedArgs: ProjectCardProps = {
  project: project2,
};

export const Completed: Story = {
  args: completedArgs,
};
