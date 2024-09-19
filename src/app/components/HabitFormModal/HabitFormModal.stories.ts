import type { Meta, StoryObj } from '@storybook/react';

import HabitFormModal from '.';
import { HabitFormModalProps } from './HabitFormModal';

const meta: Meta<typeof HabitFormModal> = {
  title: 'Example/HabitFormModal',
  component: HabitFormModal,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof HabitFormModal>;

const defaultArgs: HabitFormModalProps = {};

export const Default: Story = {
  args: defaultArgs
};
