import type { Meta, StoryObj } from "@storybook/react";

import TodayHabit from ".";
import { TodayHabitProps } from "./TodayHabit";
import { now } from "@/app/utils/date/date";
import { generateLifeAspect } from "#src/app/utils/mocks/lifeAspect";

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
    category: generateLifeAspect()._id,
    timesPerMonth: 2,
    updatedAt: "",
  },
  date: now(),
};

export const Default: Story = {
  args: defaultArgs,
};
