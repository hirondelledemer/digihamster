import type { Meta, StoryObj } from "@storybook/react";

import { Shed, ShedProps } from "./Shed";

const ShedComponent = (props: ShedProps) => (
  <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-full border bg-white">
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg viewBox="-20 50 750 400">
        <Shed {...props} />
      </svg>
    </svg>
  </div>
);

const meta: Meta<typeof Shed> = {
  title: "Garden/Shed",
  component: ShedComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Shed>;

const defaultArgs: ShedProps = {
  stage: 1,
};

export const Default: Story = {
  args: defaultArgs,
};
