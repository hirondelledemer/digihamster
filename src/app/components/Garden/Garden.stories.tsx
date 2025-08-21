import type { Meta, StoryObj } from "@storybook/react";

import { Garden, GardenProps } from "./Garden";

const meta: Meta<typeof Garden> = {
  title: "Garden/Garden",
  component: Garden,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Garden>;

const worstArgs: GardenProps = {
  config: {
    house: { score: 1, onClick: () => {} },
    tree: { score: 1, onClick: () => {} },
    shed: { score: 1, onClick: () => {} },
    animals: { score: 1, onClick: () => {} },
    river: { score: 1, onClick: () => {} },
    mountains: { score: 1, onClick: () => {} },
    pumpkinGarden: { score: 1, onClick: () => {} },
    defaultScore: { score: 1, onClick: () => {} },
  },
};

export const Worst: Story = {
  args: worstArgs,
};

const bestArgs: GardenProps = {
  config: {
    house: { score: 10, onClick: () => {} },
    tree: { score: 10, onClick: () => {} },
    shed: { score: 10, onClick: () => {} },
    animals: { score: 10, onClick: () => {} },
    river: { score: 10, onClick: () => {} },
    mountains: { score: 10, onClick: () => {} },
    pumpkinGarden: { score: 10, onClick: () => {} },
    defaultScore: { score: 10, onClick: () => {} },
  },
};

export const Best: Story = {
  args: bestArgs,
};
