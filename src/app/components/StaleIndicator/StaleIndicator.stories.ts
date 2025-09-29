import type { Meta, StoryObj } from "@storybook/react";

import StaleIndicator from ".";
import { StaleIndicatorProps } from "./StaleIndicator";
import { subSeconds } from "date-fns";
import { now } from "@/app/utils/date/date";

const days8InS = 8 * 24 * 60 * 60;
const days15inS = 15 * 24 * 60 * 60;
const meta: Meta<typeof StaleIndicator> = {
  title: "Indicators/StaleIndicator",
  component: StaleIndicator,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StaleIndicator>;

const defaultArgs: StaleIndicatorProps = {
  date: subSeconds(now(), days8InS).getTime(),
};

export const Default: Story = {
  args: defaultArgs,
};

const warningArgs: StaleIndicatorProps = {
  date: subSeconds(now(), days15inS).getTime(),
};

export const Warning: Story = {
  args: warningArgs,
};
