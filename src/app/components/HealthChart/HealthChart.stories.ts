import type { Meta, StoryObj } from '@storybook/react';

import HealthChart from '.';
import { HealthChartProps } from './HealthChart';

const meta: Meta<typeof HealthChart> = {
  title: 'Example/HealthChart',
  component: HealthChart,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof HealthChart>;

const defaultArgs: HealthChartProps = {};

export const Default: Story = {
  args: defaultArgs
};
