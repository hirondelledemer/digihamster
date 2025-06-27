import type { Meta, StoryObj } from "@storybook/react";

import HabitItem from ".";
import { HabitItemProps } from "./HabitItem";
import { CATEGORIES } from "../HabitForm/HabitForm.consts";

const meta: Meta<typeof HabitItem> = {
  title: "Example/HabitItem",
  component: HabitItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HabitItem>;

const defaultArgs: HabitItemProps = {
  habit: {
    _id: "habit1",
    title: "Habit 1",
    deleted: false,
    log: [],
    category: CATEGORIES[0],
    timesPerMonth: 2,
    updatedAt: "",
  },
};

export const Default: Story = {
  args: defaultArgs,
};
