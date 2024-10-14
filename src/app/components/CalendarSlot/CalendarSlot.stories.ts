import type { Meta, StoryObj } from "@storybook/react";

import CalendarSlot from ".";
import { CalendarSlotProps } from "./CalendarSlot";
import { now } from "@/app/utils/date/date";

const meta: Meta<typeof CalendarSlot> = {
  title: "Example/CalendarSlot",
  component: CalendarSlot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CalendarSlot>;

const defaultArgs: CalendarSlotProps = {
  children: "test",
  value: now(),
  resource: null,
};

export const Default: Story = {
  args: defaultArgs,
};
