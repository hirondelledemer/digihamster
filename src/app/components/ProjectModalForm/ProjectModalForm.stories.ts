import type { Meta, StoryObj } from '@storybook/react';

import ProjectModalForm from '.';
import { ProjectModalFormProps } from './ProjectModalForm';

const meta: Meta<typeof ProjectModalForm> = {
  title: 'Example/ProjectModalForm',
  component: ProjectModalForm,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ProjectModalForm>;

const defaultArgs: ProjectModalFormProps = {};

export const Default: Story = {
  args: defaultArgs
};
