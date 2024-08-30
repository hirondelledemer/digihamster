import { render } from '@testing-library/react';
import StaleIndicator, { StaleIndicatorProps } from './StaleIndicator';
import { getStaleIndicatorTestkit } from './StaleIndicator.testkit';

describe('StaleIndicator', () => {
  const defaultProps: StaleIndicatorProps = {};
  const renderComponent = (props = defaultProps) =>
    getStaleIndicatorTestkit(render(<StaleIndicator {...props} />).container);

  it('should render StaleIndicator', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
