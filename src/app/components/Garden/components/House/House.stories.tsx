import type { Meta, StoryObj } from "@storybook/react";

import { House, HouseProps } from "./House";

const meta: Meta<typeof House> = {
  title: "Garden/House",
  component: House,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof House>;

const defaultArgs: HouseProps = {
  stage: 10,
};

export const Default: Story = {
  args: defaultArgs,
};
