import type { Meta, StoryObj } from "@storybook/react";

import PercentagesBar from ".";
import { PercentagesBarProps } from "./PercentagesBar";

const meta: Meta<typeof PercentagesBar> = {
  title: "Charts/PercentagesBar",
  component: PercentagesBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PercentagesBar>;

const defaultArgs: PercentagesBarProps = {
  data: {
    1: {
      estimate: 5,
      percentage: 25,
      color: "pink",
      label: "label 1",
    },
    2: {
      estimate: 5,
      percentage: 25,
      color: "lime",
      label: "label 2",
    },
    3: {
      estimate: 10,
      percentage: 50,
      color: "blue",
      label: "label 3",
    },
  },
};

export const Default: Story = {
  args: defaultArgs,
};
