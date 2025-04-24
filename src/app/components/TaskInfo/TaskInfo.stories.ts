import type { Meta, StoryObj } from '@storybook/react';

import TaskInfo from '.';
import { TaskInfoProps } from './TaskInfo';

const meta: Meta<typeof TaskInfo> = {
  title: 'Example/TaskInfo',
  component: TaskInfo,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof TaskInfo>;

const defaultArgs: TaskInfoProps = {};

export const Default: Story = {
  args: defaultArgs
};
