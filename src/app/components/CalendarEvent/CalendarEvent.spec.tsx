import { render, screen } from "@/config/utils/test-utils";
import { CalendarEventProps } from "./CalendarEvent";
import CalendarEvent from "./CalendarEvent";
import { getCalendarEventTestkit } from "./CalendarEvent.testkit";
import mockAxios from "jest-mock-axios";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { CalendarEventEntry } from "./CalendarEvent.types";
import { HOUR } from "@/app/utils/consts/dates";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";

describe("CalendarEvent", () => {
  const defaultProps: CalendarEventProps = {
    event: {
      title: "Event",
      start: new Date(0),
      end: new Date(HOUR),
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
      render(
        <EventsContextProvider>
          <CalendarEvent testId="CalendarEvent-testId" {...props} />
        </EventsContextProvider>
      ).container
    );

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
        start: new Date(0),
        end: new Date(HOUR),
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
        start: new Date(0),
        end: new Date(HOUR),
        resource: {
          completed: false,
          id: "event1",
          type: "event",
          tasks: [...generateListOfTasks(2)],
        },
      },
    };

    it("should show tasks", () => {
      renderComponent(props);
      expect(
        screen.getByText(
          `${(props.event as CalendarEventEntry).resource.tasks[0].title}`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          `${(props.event as CalendarEventEntry).resource.tasks[1].title}`
        )
      ).toBeInTheDocument();
    });
  });
});
