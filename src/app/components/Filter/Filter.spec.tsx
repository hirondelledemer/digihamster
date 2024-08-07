import { render } from '@testing-library/react';
import Filter, { FilterProps } from './Filter';
import { getFilterTestkit } from './Filter.testkit';

describe('Filter', () => {
  const defaultProps: FilterProps = {};
  const renderComponent = (props = defaultProps) =>
    getFilterTestkit(render(<Filter {...props} />).container);

  it('should render Filter', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
