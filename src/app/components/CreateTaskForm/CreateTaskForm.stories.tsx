import type { Meta, StoryObj } from "@storybook/react";

import CreateTaskForm from ".";
import { CreateTaskFormProps } from "./CreateTaskForm";

import { generateListOfTags } from "@/app/utils/mocks/tag";
import { TagsStateContext } from "@/app/utils/hooks/use-tags/state-context";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";

const meta: Meta<typeof CreateTaskForm> = {
  title: "Tasks/CreateTaskForm",
  component: CreateTaskForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TagsStateContext.Provider
        value={{
          data: generateListOfTags(3),
          isLoading: false,
        }}
      >
        <ProjectsContextProvider>
          <Story />
        </ProjectsContextProvider>
      </TagsStateContext.Provider>
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
