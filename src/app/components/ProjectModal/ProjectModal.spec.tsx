import { render } from '@testing-library/react';
import ProjectModal, { ProjectModalProps } from './ProjectModal';
import { getProjectModalTestkit } from './ProjectModal.testkit';

describe('ProjectModal', () => {
  const defaultProps: ProjectModalProps = {};
  const renderComponent = (props = defaultProps) =>
    getProjectModalTestkit(render(<ProjectModal {...props} />).container);

  it('should render ProjectModal', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
