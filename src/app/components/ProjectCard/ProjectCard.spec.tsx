import { render } from "@testing-library/react";
import ProjectCard, { ProjectCardProps } from "./ProjectCard";
import { getProjectCardTestkit } from "./ProjectCard.testkit";
import { generateProject } from "@/app/utils/mocks/project";

describe("ProjectCard", () => {
  const defaultProps: ProjectCardProps = {
    project: generateProject(),
  };
  const renderComponent = (props = defaultProps) =>
    getProjectCardTestkit(render(<ProjectCard {...props} />).container);

  it("should render ProjectCard", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
