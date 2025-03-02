import type { Meta, StoryObj } from '@storybook/react';

import TaskWithRelations from '.';
import { TaskWithRelationsProps } from './TaskWithRelations';

const meta: Meta<typeof TaskWithRelations> = {
  title: 'Example/TaskWithRelations',
  component: TaskWithRelations,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof TaskWithRelations>;

const defaultArgs: TaskWithRelationsProps = {};

export const Default: Story = {
  args: defaultArgs
};
