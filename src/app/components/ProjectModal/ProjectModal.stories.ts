import type { Meta, StoryObj } from '@storybook/react';

import ProjectModal from '.';
import { ProjectModalProps } from './ProjectModal';

const meta: Meta<typeof ProjectModal> = {
  title: 'Example/ProjectModal',
  component: ProjectModal,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ProjectModal>;

const defaultArgs: ProjectModalProps = {};

export const Default: Story = {
  args: defaultArgs
};
