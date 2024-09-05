import { render } from '@testing-library/react';
import ProjectForm, { ProjectFormProps } from './ProjectForm';
import { getProjectFormTestkit } from './ProjectForm.testkit';

describe('ProjectForm', () => {
  const defaultProps: ProjectFormProps = {};
  const renderComponent = (props = defaultProps) =>
    getProjectFormTestkit(render(<ProjectForm {...props} />).container);

  it('should render ProjectForm', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
