import { render } from "@/config/utils/test-utils";
import { CalendarEventProps } from "./CalendarEvent";
import CalendarEvent from "./CalendarEvent";
import { getCalendarEventTestkit } from "./CalendarEvent.testkit";
import mockAxios from "jest-mock-axios";

describe("CalendarEvent", () => {
  const defaultProps: CalendarEventProps = {
    event: {
      title: "Event",
      resource: {
        completed: false,
        id: "event1",
      },
    },
  };

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    getCalendarEventTestkit(render(<CalendarEvent {...props} />).container);

  describe("event is not completed", () => {
    it('should  show "complete" and "delete" buttons', () => {
      const wrapper = renderComponent();
      expect(wrapper.completeButtonExists()).toBe(true);
      expect(wrapper.deleteButtonExists()).toBe(true);
    });

    it('should send "complete" request', () => {
      const wrapper = renderComponent();
      expect(wrapper.getEventTextIsStriked()).toBe(false);
      wrapper.clickCompleteButton();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/events", {
        completed: true,
        taskId: "event1",
      });
      expect(wrapper.getEventTextIsStriked()).toBe(true);
    });

    it('should send "delete" request', () => {
      const wrapper = renderComponent();
      wrapper.clickDeleteButton();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/events", {
        deleted: true,
        taskId: "event1",
      });
      /*
       this is a mistake. 
       Currently "delete event does delete CalendarEvent content, but component itself still remains"
      */
      expect(wrapper.getComponent()).toBeInTheDocument();
      expect(wrapper.completeButtonExists()).toBe(false);
      expect(wrapper.deleteButtonExists()).toBe(false);
    });
  });

  describe("event is completed", () => {
    const props: CalendarEventProps = {
      event: {
        title: "Event",
        resource: {
          completed: true,
          id: "event1",
        },
      },
    };
    it("renders completed Calendar event", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getEventTextIsStriked()).toBe(true);
    });

    it('should not show "complete" button', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.completeButtonExists()).toBe(false);
    });
  });
});
