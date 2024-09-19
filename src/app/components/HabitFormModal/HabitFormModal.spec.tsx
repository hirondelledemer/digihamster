import { render } from '@testing-library/react';
import HabitFormModal, { HabitFormModalProps } from './HabitFormModal';
import { getHabitFormModalTestkit } from './HabitFormModal.testkit';

describe('HabitFormModal', () => {
  const defaultProps: HabitFormModalProps = {};
  const renderComponent = (props = defaultProps) =>
    getHabitFormModalTestkit(render(<HabitFormModal {...props} />).container);

  it('should render HabitFormModal', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
