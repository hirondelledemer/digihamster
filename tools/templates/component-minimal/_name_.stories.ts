import type { Meta, StoryObj } from '@storybook/react';

import _name_ from '.';
import { _name_Props } from './_name_';

const meta: Meta<typeof _name_> = {
  title: 'Example/_name_',
  component: _name_,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof _name_>;

const defaultArgs: _name_Props = {};

export const Default: Story = {
  args: defaultArgs
};
