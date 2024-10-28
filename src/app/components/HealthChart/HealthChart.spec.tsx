import { render } from '@testing-library/react';
import HealthChart, { HealthChartProps } from './HealthChart';
import { getHealthChartTestkit } from './HealthChart.testkit';

describe('HealthChart', () => {
  const defaultProps: HealthChartProps = {};
  const renderComponent = (props = defaultProps) =>
    getHealthChartTestkit(render(<HealthChart {...props} />).container);

  it('should render HealthChart', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
