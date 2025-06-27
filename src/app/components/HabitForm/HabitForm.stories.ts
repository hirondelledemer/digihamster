import type { Meta, StoryObj } from "@storybook/react";

import HabitForm from ".";
import { HabitFormProps } from "./HabitForm";
import { CATEGORIES } from "./HabitForm.consts";

const meta: Meta<typeof HabitForm> = {
  title: "Example/HabitForm",
  component: HabitForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HabitForm>;

const defaultArgs: HabitFormProps = {
  initialValues: {
    title: "",
    category: CATEGORIES[0],
    timesPerMonth: 0,
  },
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
