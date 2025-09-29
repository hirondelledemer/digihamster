import type { Meta, StoryObj } from "@storybook/react";

import { Mountains, MountainsProps } from "./Mountains";

const MountainsComponent = (props: MountainsProps) => (
  <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-full border bg-white">
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg viewBox="-20 50 750 400">
        <Mountains {...props} />
      </svg>
    </svg>
  </div>
);

const meta: Meta<typeof Mountains> = {
  title: "Garden/Mountains",
  component: MountainsComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Mountains>;

const defaultArgs: MountainsProps = {
  stage: 1,
  withBoosts: false,
};

export const Default: Story = {
  args: defaultArgs,
};
