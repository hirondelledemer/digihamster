import { render } from '@testing-library/react';
import ProjectModalForm, { ProjectModalFormProps } from './ProjectModalForm';
import { getProjectModalFormTestkit } from './ProjectModalForm.testkit';

describe('ProjectModalForm', () => {
  const defaultProps: ProjectModalFormProps = {};
  const renderComponent = (props = defaultProps) =>
    getProjectModalFormTestkit(render(<ProjectModalForm {...props} />).container);

  it('should render ProjectModalForm', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
