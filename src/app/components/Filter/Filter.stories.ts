import type { Meta, StoryObj } from '@storybook/react';

import Filter from '.';
import { FilterProps } from './Filter';

const meta: Meta<typeof Filter> = {
  title: 'Example/Filter',
  component: Filter,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Filter>;

const defaultArgs: FilterProps = {};

export const Default: Story = {
  args: defaultArgs
};
