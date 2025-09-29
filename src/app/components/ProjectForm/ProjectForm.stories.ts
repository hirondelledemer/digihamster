import type { Meta, StoryObj } from "@storybook/react";

import ProjectForm from ".";
import { ProjectFormProps } from "./ProjectForm";

const meta: Meta<typeof ProjectForm> = {
  title: "Projects/ProjectForm",
  component: ProjectForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProjectForm>;

const defaultArgs: ProjectFormProps = {
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
