import { render } from "@testing-library/react";
import CalendarSlot, { CalendarSlotProps } from "./CalendarSlot";
import { getCalendarSlotTestkit } from "./CalendarSlot.testkit";
import { now } from "@/app/utils/date/date";

describe("CalendarSlot", () => {
  const defaultProps: CalendarSlotProps = {
    children: "test",
    value: now(),
    resource: null,
  };
  const renderComponent = (props = defaultProps) =>
    getCalendarSlotTestkit(render(<CalendarSlot {...props} />).container);

  it("should render CalendarSlot", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
