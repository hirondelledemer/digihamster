import { render } from "@testing-library/react";
import PercentagesBar, { PercentagesBarProps } from "./PercentagesBar";
import { getPercentagesBarTestkit } from "./PercentagesBar.testkit";

describe("PercentagesBar", () => {
  const defaultProps: PercentagesBarProps = { data: {} };
  const renderComponent = (props = defaultProps) =>
    getPercentagesBarTestkit(render(<PercentagesBar {...props} />).container);

  it("should render PercentagesBar", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
