import { render } from "@/config/utils/test-utils";
import HealthChart, { HealthChartProps } from "./HealthChart";
import { wrapWithHabitsProvider } from "@/app/utils/tests/wraps";

describe("HealthChart", () => {
  const defaultProps: HealthChartProps = {};
  const renderComponent = (props = defaultProps) =>
    render(wrapWithHabitsProvider(<HealthChart {...props} />)).container;

  it("should render HealthChart", () => {
    expect(renderComponent()).not.toBe(null);
  });
});
