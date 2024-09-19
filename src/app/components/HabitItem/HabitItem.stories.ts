import type { Meta, StoryObj } from '@storybook/react';

import HabitItem from '.';
import { HabitItemProps } from './HabitItem';

const meta: Meta<typeof HabitItem> = {
  title: 'Example/HabitItem',
  component: HabitItem,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof HabitItem>;

const defaultArgs: HabitItemProps = {};

export const Default: Story = {
  args: defaultArgs
};
