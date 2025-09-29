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
    house: { score: 1, onClick: () => {}, withBoosts: false },
    tree: { score: 1, onClick: () => {}, withBoosts: false },
    shed: { score: 1, onClick: () => {}, withBoosts: false },
    animals: { score: 1, onClick: () => {}, withBoosts: false },
    river: { score: 1, onClick: () => {}, withBoosts: false },
    mountains: { score: 1, onClick: () => {}, withBoosts: false },
    pumpkinGarden: { score: 1, onClick: () => {}, withBoosts: false },
    defaultScore: { score: 1, onClick: () => {}, withBoosts: false },
  },
};

export const Worst: Story = {
  args: worstArgs,
};

const bestArgs: GardenProps = {
  config: {
    house: { score: 10, onClick: () => {}, withBoosts: false },
    tree: { score: 10, onClick: () => {}, withBoosts: false },
    shed: { score: 10, onClick: () => {}, withBoosts: false },
    animals: { score: 10, onClick: () => {}, withBoosts: false },
    river: { score: 10, onClick: () => {}, withBoosts: false },
    mountains: { score: 10, onClick: () => {}, withBoosts: false },
    pumpkinGarden: { score: 10, onClick: () => {}, withBoosts: false },
    defaultScore: { score: 10, onClick: () => {}, withBoosts: false },
  },
};

export const Best: Story = {
  args: bestArgs,
};
