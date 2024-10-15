import { render } from "@testing-library/react";
import ProjectBurnDownChart, {
  ProjectBurnDownChartProps,
} from "./ProjectBurnDownChart";
import { getProjectBurnDownChartTestkit } from "./ProjectBurnDownChart.testkit";

describe("ProjectBurnDownChart", () => {
  const defaultProps: ProjectBurnDownChartProps = {
    projectId: "project0",
  };
  const renderComponent = (props = defaultProps) =>
    getProjectBurnDownChartTestkit(
      render(<ProjectBurnDownChart {...props} />).container
    );

  it("should render ProjectBurnDownChart", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
