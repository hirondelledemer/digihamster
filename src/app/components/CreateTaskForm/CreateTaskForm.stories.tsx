import type { Meta, StoryObj } from "@storybook/react";

import CreateTaskForm from ".";
import { CreateTaskFormProps } from "./CreateTaskForm";

import { generateListOfTags } from "@/app/utils/mocks/tag";
import { TagsContext } from "@/app/utils/hooks/use-tags";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";

const meta: Meta<typeof CreateTaskForm> = {
  title: "Tasks/CreateTaskForm",
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
        <ProjectsContextProvider>
          <Story />
        </ProjectsContextProvider>
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
