import type { Meta, StoryObj } from "@storybook/react";

import DailyProgress from ".";
import { DailyProgressProps } from "./DailyProgress";

const meta: Meta<typeof DailyProgress> = {
  title: "Charts/DailyProgress",
  component: DailyProgress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DailyProgress>;

const defaultArgs: DailyProgressProps = {};

export const Default: Story = {
  args: defaultArgs,
};
