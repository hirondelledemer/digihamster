import type { Meta, StoryObj } from "@storybook/react";

import Timeline from ".";
import { TimelineProps } from "./Timeline";

const meta: Meta<typeof Timeline> = {
  title: "Example/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const defaultArgs: TimelineProps = {};

// todo: add wrappers
export const Default: Story = {
  args: defaultArgs,
};
