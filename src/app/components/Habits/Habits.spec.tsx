import { render } from '@testing-library/react';
import Habits, { HabitsProps } from './Habits';
import { getHabitsTestkit } from './Habits.testkit';

describe('Habits', () => {
  const defaultProps: HabitsProps = {};
  const renderComponent = (props = defaultProps) =>
    getHabitsTestkit(render(<Habits {...props} />).container);

  it('should render Habits', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
