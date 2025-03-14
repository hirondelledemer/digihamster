import type { Meta, StoryObj } from "@storybook/react";

import TimelineChart from ".";
import { TimelineChartProps } from "./TimelineChart";
import { format, sub } from "date-fns";
import { now } from "@/app/utils/date/date";

const meta: Meta<typeof TimelineChart> = {
  title: "Example/TimelineChart",
  component: TimelineChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TimelineChart>;

const defaultArgs: TimelineChartProps = {
  chartConfig: {
    project1: {
      color: "#FF6B6B",
      label: "Project 1",
    },
    project2: {
      color: "#713f12",
      label: "Project 2",
    },
    project3: {
      color: "#84cc16",
      label: "Project 3",
    },
  },
  chartData: [
    {
      day: format("2025-3-23", "dd, E"),
      project1: 1,
      project2: 4,
      project3: 3,
    },
    {
      day: format("2025-3-24", "dd, E"),
      project1: 3,
      project2: 0,
      project3: 3,
    },
    {
      day: format("2025-3-25", "dd, E"),
      project1: 4,
      project2: 2,
      project3: 1,
    },
  ],
};

export const Default: Story = {
  args: defaultArgs,
};
