import { render } from '@testing-library/react';
import EventTaskFormModal, { EventTaskFormModalProps } from './EventTaskFormModal';
import { getEventTaskFormModalTestkit } from './EventTaskFormModal.testkit';

describe('EventTaskFormModal', () => {
  const defaultProps: EventTaskFormModalProps = {};
  const renderComponent = (props = defaultProps) =>
    getEventTaskFormModalTestkit(render(<EventTaskFormModal {...props} />).container);

  it('should render EventTaskFormModal', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
