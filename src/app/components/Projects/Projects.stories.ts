import type { Meta, StoryObj } from '@storybook/react';

import Projects from '.';
import { ProjectsProps } from './Projects';

const meta: Meta<typeof Projects> = {
  title: 'Example/Projects',
  component: Projects,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Projects>;

const defaultArgs: ProjectsProps = {};

export const Default: Story = {
  args: defaultArgs
};
