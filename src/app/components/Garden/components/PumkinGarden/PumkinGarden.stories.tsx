import type { Meta, StoryObj } from "@storybook/react";

import { PumpkinGarden, PumpkinGardenProps } from "./PumpkinGarden";

const PumpkinGardenComponent = (props: PumpkinGardenProps) => (
  <div className="mt-8 mx-auto w-full max-w-4xl rounded-xl overflow-hidden shadow-full border bg-white">
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg viewBox="-20 50 750 400">
        <PumpkinGarden {...props} />
      </svg>
    </svg>
  </div>
);

const meta: Meta<typeof PumpkinGarden> = {
  title: "Garden/PumpkinGarden",
  component: PumpkinGardenComponent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PumpkinGarden>;

const defaultArgs: PumpkinGardenProps = {
  stage: 1,
};

export const Default: Story = {
  args: defaultArgs,
};
