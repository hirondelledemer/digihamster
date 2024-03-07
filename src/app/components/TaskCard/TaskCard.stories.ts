import type { Meta, StoryObj } from '@storybook/react';

import TaskCard from '.';
import { TaskCardProps } from './TaskCard';

const meta: Meta<typeof TaskCard> = {
  title: 'Example/TaskCard',
  component: TaskCard,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

const defaultArgs: TaskCardProps = {};

export const Default: Story = {
  args: defaultArgs
};
