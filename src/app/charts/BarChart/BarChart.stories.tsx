import type { Meta, StoryObj } from "@storybook/react";

import { BarChart } from ".";
import { BarChartProps } from "./BarChart";

const meta: Meta<typeof BarChart> = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

const defaultArgs: BarChartProps = {
  data: [
    {
      dataLabel: "Category 1",
      dataValue: 10,
      fill: "hsl(var(--scale-color-1))",
    },
    {
      dataLabel: "Category 2",
      dataValue: 20,
      fill: "hsl(var(--scale-color-2))",
    },
    {
      dataLabel: "Category 3",
      dataValue: 30,
      fill: "hsl(var(--scale-color-3))",
    },
    {
      dataLabel: "Category 4",
      dataValue: 40,
      fill: "hsl(var(--scale-color-4))",
    },
    {
      dataLabel: "Category 5",
      dataValue: 50,
      fill: "hsl(var(--scale-color-5))",
    },
    {
      dataLabel: "Category 6",
      dataValue: 60,
      fill: "hsl(var(--scale-color-6))",
    },
    {
      dataLabel: "Category 7",
      dataValue: 70,
      fill: "hsl(var(--scale-color-7))",
    },
    {
      dataLabel: "Category 8",
      dataValue: 80,
      fill: "hsl(var(--scale-color-8))",
    },
    {
      dataLabel: "Category 9",
      dataValue: 90,
      fill: "hsl(var(--scale-color-9))",
    },
    {
      dataLabel: "Category 10",
      dataValue: 100,
      fill: "hsl(var(--scale-color-10))",
    },
  ],
};

export const Default: Story = {
  args: defaultArgs,
};
