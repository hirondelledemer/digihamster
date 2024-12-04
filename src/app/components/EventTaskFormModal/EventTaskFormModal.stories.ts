import type { Meta, StoryObj } from '@storybook/react';

import EventTaskFormModal from '.';
import { EventTaskFormModalProps } from './EventTaskFormModal';

const meta: Meta<typeof EventTaskFormModal> = {
  title: 'Example/EventTaskFormModal',
  component: EventTaskFormModal,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof EventTaskFormModal>;

const defaultArgs: EventTaskFormModalProps = {};

export const Default: Story = {
  args: defaultArgs
};
