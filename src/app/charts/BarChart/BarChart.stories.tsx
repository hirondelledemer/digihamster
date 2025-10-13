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
  config: {},
  data: [
    {
      dataLabel: "Category 1",
      dataValue: 10,
      fill: "hsl(var(--scale-color-1))",
      getFillColor: () => "",
      _id: "category1",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 2",
      dataValue: 20,
      fill: "hsl(var(--scale-color-2))",
      getFillColor: () => "",
      _id: "category2",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 3",
      dataValue: 30,
      fill: "hsl(var(--scale-color-3))",
      getFillColor: () => "",
      _id: "category3",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 4",
      dataValue: 40,
      fill: "hsl(var(--scale-color-4))",
      getFillColor: () => "",
      _id: "category4",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 5",
      dataValue: 50,
      fill: "hsl(var(--scale-color-5))",
      getFillColor: () => "",
      _id: "category5",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 6",
      dataValue: 60,
      fill: "hsl(var(--scale-color-6))",
      getFillColor: () => "",
      _id: "category6",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 7",
      dataValue: 70,
      fill: "hsl(var(--scale-color-7))",
      getFillColor: () => "",
      _id: "category7",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 8",
      dataValue: 80,
      fill: "hsl(var(--scale-color-8))",
      getFillColor: () => "",
      _id: "category8",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 9",
      dataValue: 90,
      fill: "hsl(var(--scale-color-9))",
      getFillColor: () => "",
      _id: "category9",
      actions: [{ onClick: () => {} }],
    },
    {
      dataLabel: "Category 10",
      dataValue: 100,
      fill: "hsl(var(--scale-color-10))",
      getFillColor: () => "",
      _id: "category10",
      actions: [{ onClick: () => {} }],
    },
  ],
};

export const Default: Story = {
  args: defaultArgs,
};
