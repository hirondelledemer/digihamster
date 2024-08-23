import { render } from '@testing-library/react';
import TaskFormModal, { TaskFormModalProps } from './TaskFormModal';
import { getTaskFormModalTestkit } from './TaskFormModal.testkit';

describe('TaskFormModal', () => {
  const defaultProps: TaskFormModalProps = {};
  const renderComponent = (props = defaultProps) =>
    getTaskFormModalTestkit(render(<TaskFormModal {...props} />).container);

  it('should render TaskFormModal', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
