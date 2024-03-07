import type { Meta, StoryObj } from '@storybook/react';

import ActiveTaskList from '.';
import { ActiveTaskListProps } from './ActiveTaskList';

const meta: Meta<typeof ActiveTaskList> = {
  title: 'Example/ActiveTaskList',
  component: ActiveTaskList,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ActiveTaskList>;

const defaultArgs: ActiveTaskListProps = {};

export const Default: Story = {
  args: defaultArgs
};
