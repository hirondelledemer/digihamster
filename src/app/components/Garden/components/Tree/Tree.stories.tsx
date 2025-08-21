import type { Meta, StoryObj } from "@storybook/react";

import { Tree, TreeProps } from "./Tree";

const TreeComponent = (props: TreeProps) => (
  <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-full border bg-white">
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg viewBox="-20 50 750 400">
        <Tree {...props} />
      </svg>
    </svg>
  </div>
);

const meta: Meta<typeof Tree> = {
  title: "Garden/Tree",
  component: TreeComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tree>;

const defaultArgs: TreeProps = {
  stage: 10,
};

export const Default: Story = {
  args: defaultArgs,
};
