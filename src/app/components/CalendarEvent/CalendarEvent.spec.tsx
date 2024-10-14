import { render, screen } from "@/config/utils/test-utils";
import { CalendarEventProps } from "./CalendarEvent";
import CalendarEvent from "./CalendarEvent";
import { getCalendarEventTestkit } from "./CalendarEvent.testkit";
import mockAxios from "jest-mock-axios";
import { generateListOfTasks, generateTask } from "@/app/utils/mocks/task";
import { CalendarEventEntry } from "./CalendarEvent.types";

describe("CalendarEvent", () => {
  const defaultProps: CalendarEventProps = {
    event: {
      title: "Event",
      resource: {
        completed: false,
        id: "event1",
        type: "event",
        tasks: [],
      },
    },
  };

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    getCalendarEventTestkit(
      render(<CalendarEvent testId="CalendarEvent-testId" {...props} />)
        .container
    );

  it("should not show deadline tag", () => {
    const wrapper = renderComponent();
    expect(wrapper.deadlineLabelExists()).toBe(false);
  });

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
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/events", {
        completed: true,
        eventId: "event1",
      });
    });

    it('should send "delete" request', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: {} });
      const props: CalendarEventProps = {
        ...defaultProps,
      };

      const wrapper = renderComponent(props);

      wrapper.clickDeleteButton();

      expect(mockAxios.patch).toHaveBeenCalledWith("/api/events", {
        deleted: true,
        eventId: "event1",
      });
    });
  });

  describe("event is completed", () => {
    const props: CalendarEventProps = {
      event: {
        title: "Event",
        resource: {
          completed: true,
          id: "event1",
          type: "event",
          tasks: [],
        },
      },
    };

    it('should not show "complete" button', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.completeButtonExists()).toBe(false);
    });
  });

  describe("event has tasks", () => {
    const props: CalendarEventProps = {
      event: {
        title: "Event",
        resource: {
          completed: false,
          id: "event1",
          type: "event",
          tasks: [...generateListOfTasks(2)],
        },
      },
    };

    it("should not show tasks", () => {
      const wrapper = renderComponent(props);
      expect(
        wrapper.getByText(
          `${(props.event as CalendarEventEntry).resource.tasks[0].title}`
        )
      ).toBeInTheDocument();
      expect(
        wrapper.getByText(
          `${(props.event as CalendarEventEntry).resource.tasks[1].title}`
        )
      ).toBeInTheDocument();
    });
  });
});
