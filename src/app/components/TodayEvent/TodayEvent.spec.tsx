import { generateTask } from "@/app/utils/mocks/task";
import TodayEvent, { TodayEventProps } from "./TodayEvent";
import { getTodayEventTestkit } from "./TodayEvent.testkit";
import { render, screen, userEvent } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";

describe("TodayEvent", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: TodayEventProps = {
    isFocused: false,
    event: {
      title: "Title",
      start: new Date(),
      resource: {
        completed: false,
        id: "event1",
        type: "event",
        description: "",
        tasks: [],
      },
    },
  };
  const renderComponent = (props = defaultProps) =>
    getTodayEventTestkit(
      render(
        <EventsContextProvider>
          <TodayEvent {...props} />
        </EventsContextProvider>
      ).container
    );

  it("should render TodayEvent", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });

  it("should not show deadline label", () => {
    const { getComponent } = renderComponent();
    expect(getComponent().textContent).toBe("Title");
  });

  it('should not show "move back to list" icon', () => {
    renderComponent();

    expect(
      screen.queryByRole("button", { name: /move back to list/i })
    ).not.toBeInTheDocument();
  });

  describe("event is a task", () => {
    const props: TodayEventProps = {
      isFocused: false,
      event: {
        title: "Title",
        start: new Date(),
        resource: {
          completed: false,
          id: "event1",
          type: "deadline",
          task: generateTask(),
        },
      },
    };

    it("should move back to list", async () => {
      renderComponent(props);

      const button = screen.getByRole("button", { name: /move back to list/i });
      expect(button).toBeInTheDocument();
      await userEvent.click(button);

      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/v2", {
        deadline: null,
        taskId: props.event.resource.id,
      });
    });
  });

  describe("event is all day", () => {
    const props: TodayEventProps = {
      isFocused: false,
      event: {
        title: "Title",
        allDay: true,
        start: new Date(),
        resource: {
          completed: false,
          id: "event1",
          type: "event",
          description: "",
          tasks: [],
        },
      },
    };

    it("should show label all day", () => {
      const { getAllDayLabel } = renderComponent(props);
      expect(getAllDayLabel()).toBeInTheDocument();
    });

    it("should show title", () => {
      const { getTitle } = renderComponent(props);
      expect(getTitle(props.event.title as string)).toBeInTheDocument();
    });

    it("should show checkbox in red", () => {
      const { getCheckbox, checkboxIsPrimary } = renderComponent(props);
      expect(getCheckbox()).toBeInTheDocument();
      expect(checkboxIsPrimary()).toBe(true);
    });

    it("should complete task", () => {
      const { clickCheckbox } = renderComponent(props);
      clickCheckbox();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/events", {
        completed: true,
        eventId: "event1",
      });
    });
  });

  describe("event is not all day", () => {
    const props: TodayEventProps = {
      isFocused: false,
      event: {
        title: "Title",
        start: new Date(0),
        end: new Date(800000000),
        resource: {
          completed: false,
          id: "event1",
          type: "event",
          description: "",
          tasks: [],
        },
      },
    };

    it("should show label with time", () => {
      const { getTimeLabel } = renderComponent(props);
      expect(getTimeLabel("0:00-6:13")).toBeInTheDocument();
    });

    it("should show title", () => {
      const { getTitle } = renderComponent(props);
      expect(getTitle(props.event.title as string)).toBeInTheDocument();
    });

    it("should show checkbox", () => {
      const { getCheckbox } = renderComponent(props);
      expect(getCheckbox()).toBeInTheDocument();
    });
  });

  describe("event is completed", () => {
    const props: TodayEventProps = {
      isFocused: false,
      event: {
        title: "Title",
        start: new Date(0),
        end: new Date(800000000),
        resource: {
          completed: true,
          id: "event1",
          type: "event",
          description: "",
          tasks: [],
        },
      },
    };

    it.skip("should show strike-through", () => {
      const { getTitle } = renderComponent(props);
      expect(getTitle(props.event.title as string)).toBeInTheDocument();
      // todo: find out how to test
      // expect(wrapper.componentHasAStrike(props.title as string)).toBe(true);
    });

    it("shold show grey checkbox", () => {
      const { checkboxIsSecondary } = renderComponent(props);
      expect(checkboxIsSecondary()).toBe(true);
    });
  });
});
