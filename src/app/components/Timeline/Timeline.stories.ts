import type { Meta, StoryObj } from "@storybook/react";

import Timeline from ".";
import { TimelineProps } from "./Timeline";

import { now } from "@/app/utils/date/date.mock";

const TODAY_DATE = new Date("2024-02-14");

const meta: Meta<typeof Timeline> = {
  title: "Example/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const defaultArgs: TimelineProps = {};

// todo: add wrappers
export const Default: Story = {
  async beforeEach() {
    now.mockReturnValue(TODAY_DATE);
  },

  args: defaultArgs,
};
