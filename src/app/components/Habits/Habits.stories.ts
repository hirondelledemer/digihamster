import type { Meta, StoryObj } from '@storybook/react';

import Habits from '.';
import { HabitsProps } from './Habits';

const meta: Meta<typeof Habits> = {
  title: 'Example/Habits',
  component: Habits,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Habits>;

const defaultArgs: HabitsProps = {};

export const Default: Story = {
  args: defaultArgs
};
