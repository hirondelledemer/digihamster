import type { Meta, StoryObj } from '@storybook/react';

import CommandTool from '.';
import { CommandToolProps } from './CommandTool';

const meta: Meta<typeof CommandTool> = {
  title: 'Example/CommandTool',
  component: CommandTool,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof CommandTool>;

const defaultArgs: CommandToolProps = {};

export const Default: Story = {
  args: defaultArgs
};
