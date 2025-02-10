import { render } from "@testing-library/react";
import StaleIndicator, { StaleIndicatorProps } from "./StaleIndicator";
import { getStaleIndicatorTestkit } from "./StaleIndicator.testkit";

describe("StaleIndicator", () => {
  const defaultProps: StaleIndicatorProps = {
    date: 0,
  };
  const renderComponent = (props = defaultProps) =>
    getStaleIndicatorTestkit(render(<StaleIndicator {...props} />).container);

  it("should render StaleIndicator", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
