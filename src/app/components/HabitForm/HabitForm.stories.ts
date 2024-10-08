import type { Meta, StoryObj } from "@storybook/react";

import HabitForm from ".";
import { HabitFormProps } from "./HabitForm";

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
    category: "",
    timesPerMonth: 0,
  },
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
