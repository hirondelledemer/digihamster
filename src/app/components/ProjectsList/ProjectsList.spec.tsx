import { render } from "@testing-library/react";
import ProjectsList, { ProjectsListProps } from "./ProjectsList";
import { getProjectsListTestkit } from "./ProjectsList.testkit";
import { generateListOfProjects } from "@/app/utils/mocks/project";

describe("ProjectsList", () => {
  const projects = generateListOfProjects(2);

  const defaultProps: ProjectsListProps = {
    projects,
    onSelect: jest.fn(),
  };
  const renderComponent = (props = defaultProps) =>
    getProjectsListTestkit(render(<ProjectsList {...props} />).container);

  it("should render projects", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent().textContent).toBe("Project 0Project 1");
  });

  it("should select project", () => {
    const onSelectMock = jest.fn();
    const props: ProjectsListProps = {
      ...defaultProps,
      onSelect: onSelectMock,
    };
    const wrapper = renderComponent(props);
    wrapper.clickProject("Project 1");
    expect(onSelectMock).toHaveBeenCalledWith("project1");
  });
});
