import type { Meta, StoryObj } from "@storybook/react";

import TimelineChart from ".";
import { TimelineChartProps } from "./TimelineChart";
import { sub } from "date-fns";
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
      day: sub(now(), {
        days: 1,
      }),
      project1: 1,
      project2: 4,
      project3: 3,
    },
    {
      day: sub(now(), {
        days: 2,
      }),
      project1: 3,
      project2: 0,
      project3: 3,
    },
    {
      day: sub(now(), {
        days: 3,
      }),
      project1: 4,
      project2: 2,
      project3: 1,
    },
  ],
};

export const Default: Story = {
  args: defaultArgs,
};
