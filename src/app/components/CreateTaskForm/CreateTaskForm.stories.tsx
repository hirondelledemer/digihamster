import type { Meta, StoryObj } from "@storybook/react";

import CreateTaskForm from ".";
import { CreateTaskFormProps } from "./CreateTaskForm";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { generateListOfProjects } from "@/app/utils/mocks/project";
import { Project } from "@/models/project";
import { generateListOfTags } from "@/app/utils/mocks/tag";
import { TagsContext } from "@/app/utils/hooks/use-tags";

const meta: Meta<typeof CreateTaskForm> = {
  title: "Example/CreateTaskForm",
  component: CreateTaskForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TagsContext.Provider
        value={{
          data: generateListOfTags(3),
          loading: false,
          setData: () => {},
        }}
      >
        <ProjectsContext.Provider
          value={{
            data: generateListOfProjects(3),
            updateProject: () => {},
            createProject: () => {},
            getProjectById: () => ({} as Project),
            updateProjectsOrder: () => {},
            loading: false,
            setData: () => {},
          }}
        >
          <Story />
        </ProjectsContext.Provider>
      </TagsContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateTaskForm>;

const defaultArgs: CreateTaskFormProps = {
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
