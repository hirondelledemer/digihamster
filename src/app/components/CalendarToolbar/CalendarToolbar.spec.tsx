import { now } from "@/app/utils/date/date";
import CalendarToolbar, { CalendarToolbarProps } from "./CalendarToolbar";
import { getCalendarToolbarTestkit } from "./CalendarToolbar.testkit";
import { render } from "@/config/utils/test-utils";

describe("CalendarToolbar", () => {
  const defaultProps: CalendarToolbarProps = {
    onNavigate: jest.fn(),
    label: "Label",
    onView: jest.fn(),
    date: new Date(now()),
    view: "day",
    views: [],
    localizer: { messages: {} },
  };
  const renderComponent = (props = defaultProps) =>
    getCalendarToolbarTestkit(render(<CalendarToolbar {...props} />).container);

  it("should render CalendarToolbar", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe("hot keys", () => {
    /*
      currently react-big-calendar supports "week", "month", "day" and "work_week"
      since "work_week" is not used as is, "today" view is coded as "work_week"
    */
    it('should show "today view" when "T" is pressed', () => {
      const onViewSpy = jest.fn();

      const wrapper = renderComponent({
        ...defaultProps,
        onView: onViewSpy,
      });
      wrapper.pressT();
      expect(onViewSpy).toHaveBeenCalledWith("work_week");
    });

    it('should show "day" when "D" is pressed', () => {
      const onViewSpy = jest.fn();

      const wrapper = renderComponent({
        ...defaultProps,
        onView: onViewSpy,
      });
      wrapper.pressD();
      expect(onViewSpy).toHaveBeenCalledWith("day");
    });

    it('should show "week" when "W" is pressed', () => {
      const onViewSpy = jest.fn();

      const wrapper = renderComponent({
        ...defaultProps,
        onView: onViewSpy,
      });
      wrapper.pressW();
      expect(onViewSpy).toHaveBeenCalledWith("week");
    });
  });
});
