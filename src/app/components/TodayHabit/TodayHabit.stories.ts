import type { Meta, StoryObj } from "@storybook/react";

import TodayHabit from ".";
import { TodayHabitProps } from "./TodayHabit";
import { now } from "@/app/utils/date/date";

const meta: Meta<typeof TodayHabit> = {
  title: "Example/TodayHabit",
  component: TodayHabit,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TodayHabit>;

const defaultArgs: TodayHabitProps = {
  habit: {
    _id: "habit1",
    title: "Habit 1",
    deleted: false,
    log: [],
    category: "",
    timesPerMonth: 2,
    updatedAt: "",
  },
  date: now(),
  percentage: 1,
};

export const Default: Story = {
  args: defaultArgs,
};
