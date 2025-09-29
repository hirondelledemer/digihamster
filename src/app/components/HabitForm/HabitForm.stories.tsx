import type { Meta, StoryObj } from "@storybook/react";

import HabitForm from ".";
import { HabitFormProps } from "./HabitForm";
import {
  generateLifeAspect,
  generateListOfLifeAspects,
} from "@/app/utils/mocks/lifeAspect";

import { LifeAspectsStateContext } from "@/app/utils/hooks/use-life-aspects/state-context";

const meta: Meta<typeof HabitForm> = {
  title: "Habits/HabitForm",
  component: HabitForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <LifeAspectsStateContext.Provider
        value={{ data: generateListOfLifeAspects(2), isLoading: false }}
      >
        <Story />
      </LifeAspectsStateContext.Provider>
    ),
  ],
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
