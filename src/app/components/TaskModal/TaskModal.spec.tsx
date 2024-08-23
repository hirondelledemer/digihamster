import { render } from '@testing-library/react';
import TaskModal, { TaskModalProps } from './TaskModal';
import { getTaskModalTestkit } from './TaskModal.testkit';

describe('TaskModal', () => {
  const defaultProps: TaskModalProps = {};
  const renderComponent = (props = defaultProps) =>
    getTaskModalTestkit(render(<TaskModal {...props} />).container);

  it('should render TaskModal', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
