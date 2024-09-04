import { render } from '@testing-library/react';
import Projects, { ProjectsProps } from './Projects';
import { getProjectsTestkit } from './Projects.testkit';

describe('Projects', () => {
  const defaultProps: ProjectsProps = {};
  const renderComponent = (props = defaultProps) =>
    getProjectsTestkit(render(<Projects {...props} />).container);

  it('should render Projects', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
