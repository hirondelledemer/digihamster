import type { Meta, StoryObj } from "@storybook/react";

import HabitForm from ".";
import { HabitFormProps } from "./HabitForm";
import { generateLifeAspect } from "#src/app/utils/mocks/lifeAspect";

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
    category: generateLifeAspect()._id,
    timesPerMonth: 0,
  },
  onDone: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
