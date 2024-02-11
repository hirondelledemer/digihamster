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
    it('should show "today view" when "A" is pressed', () => {
      const onViewSpy = jest.fn();

      const wrapper = renderComponent({
        ...defaultProps,
        onView: onViewSpy,
      });
      wrapper.pressA();
      expect(onViewSpy).toHaveBeenCalledWith("agenda");
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

    it('should navigate to "today" when "t" is pressed', () => {
      const onNavigateSpy = jest.fn();

      const wrapper = renderComponent({
        ...defaultProps,
        onNavigate: onNavigateSpy,
      });
      wrapper.pressT();
      expect(onNavigateSpy).toHaveBeenCalledWith("TODAY");
    });
  });
});
