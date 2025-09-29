import type { Meta, StoryObj } from "@storybook/react";

import ProjectModalForm from ".";
import { ProjectModalFormProps } from "./ProjectModalForm";

const meta: Meta<typeof ProjectModalForm> = {
  title: "Projects/ProjectModalForm",
  component: ProjectModalForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProjectModalForm>;

const defaultArgs: ProjectModalFormProps = {
  open: true,
  onClose: () => {},
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
