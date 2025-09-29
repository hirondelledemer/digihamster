import type { Meta, StoryObj } from "@storybook/react";

import HabitFormModal from ".";
import { HabitFormModalProps } from "./HabitFormModal";
import { LifeAspectsStateContext } from "@/app/utils/hooks/use-life-aspects/state-context";
import { generateListOfLifeAspects } from "@/app/utils/mocks/lifeAspect";

const meta: Meta<typeof HabitFormModal> = {
  title: "Habits/HabitFormModal",
  component: HabitFormModal,
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
type Story = StoryObj<typeof HabitFormModal>;

const defaultArgs: HabitFormModalProps = {
  open: true,
  onClose: () => {},
};

export const Default: Story = {
  args: defaultArgs,
};
