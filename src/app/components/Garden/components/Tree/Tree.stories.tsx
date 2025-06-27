import type { Meta, StoryObj } from "@storybook/react";

import { Tree, TreeProps } from "./Tree";

const meta: Meta<typeof Tree> = {
  title: "Garden/Tree",
  component: Tree,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tree>;

const defaultArgs: TreeProps = {
  stage: 10,
};

export const Default: Story = {
  args: defaultArgs,
};
