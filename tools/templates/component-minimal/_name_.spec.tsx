import { render } from '@testing-library/react';
import _name_, { _name_Props } from './_name_';
import { get_name_Testkit } from './_name_.testkit';

describe('_name_', () => {
  const defaultProps: _name_Props = {};
  const renderComponent = (props = defaultProps) =>
    get_name_Testkit(render(<_name_ {...props} />).container);

  it('should render _name_', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
