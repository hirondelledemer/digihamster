import { generateTask } from "@/app/utils/mocks/task";
import TodayEvent, { TodayEventProps } from "./TodayEvent";
import { getTodayEventTestkit } from "./TodayEvent.testkit";
import { render } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";

describe("TodayEvent", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: TodayEventProps = {
    event: {
      title: "Title",
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
    getTodayEventTestkit(render(<TodayEvent {...props} />).container);

  it("should render TodayEvent", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("should not show deadline label", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent().textContent).toBe("Title");
  });

  describe("event is a task with a deadline", () => {
    const props: TodayEventProps = {
      event: {
        title: "Title",
        resource: {
          completed: false,
          id: "event1",
          type: "deadline",
          task: generateTask(),
        },
      },
    };

    it("should should not show deadline label", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getComponent().textContent).toBe(
        "Titletask description 1"
      );
    });
  });

  describe("event is all day", () => {
    const props: TodayEventProps = {
      event: {
        title: "Title",
        allDay: true,
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
      const wrapper = renderComponent(props);
      expect(wrapper.getAllDayLabel()).toBeInTheDocument();
    });

    it("should show title", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getTitle(props.event.title as string)).toBeInTheDocument();
    });

    it("should show checkbox in red", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getCheckbox()).toBeInTheDocument();
      expect(wrapper.checkboxIsPrimary()).toBe(true);
    });

    it("should complete task", () => {
      const wrapper = renderComponent(props);
      wrapper.clickCheckbox();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/events", {
        completed: true,
        eventId: "event1",
      });
    });
  });

  describe("event is not all day", () => {
    const props: TodayEventProps = {
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
      const wrapper = renderComponent(props);
      expect(wrapper.getTimeLabel("0:00-6:13")).toBeInTheDocument();
    });

    it("should show title", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getTitle(props.event.title as string)).toBeInTheDocument();
    });

    it("should show checkbox", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getCheckbox()).toBeInTheDocument();
    });
  });

  describe("event is completed", () => {
    const props: TodayEventProps = {
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
      const wrapper = renderComponent(props);
      expect(wrapper.getTitle(props.event.title as string)).toBeInTheDocument();
      // todo: find out how to test
      // expect(wrapper.componentHasAStrike(props.title as string)).toBe(true);
    });

    it("shold show grey checkbox", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.checkboxIsSecondary()).toBe(true);
    });
  });
});
