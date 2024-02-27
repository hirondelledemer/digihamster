import { render } from "@/config/utils/test-utils";
import { getCalendarTestkit } from "./Calendar.testkit";
import Calendar, { PlannerProps } from "./Calendar";

describe("Calendar", () => {
  const defaultProps: PlannerProps = { view: "day" };
  const renderComponent = (props = defaultProps) =>
    getCalendarTestkit(render(<Calendar {...props} />).container);

  it("should render", () => {
    const wrapper = renderComponent();

    wrapper.clickEventSlot();
    expect(wrapper.getComponent()).toBeInTheDocument();
  });
});
