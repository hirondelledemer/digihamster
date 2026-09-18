import { render, screen, fireEvent } from "@/config/utils/test-utils";
import CalendarEvent, { CalendarEventProps } from "./CalendarEvent";
import mockAxios from "jest-mock-axios";
import { generateEvent } from "@/app/utils/mocks/event";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { generateHabit } from "@/app/utils/mocks/habit";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { getEventsPath } from "@/app/utils/hooks/use-events/api";
import { EventStatus } from "@/app/utils/types/event";
import { addHours } from "date-fns";
import { DndContext } from "@dnd-kit/core";

const routerPushSpy = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    replace: jest.fn(),
    push: routerPushSpy,
  }),
}));

describe("CalendarEvent", () => {
  const EVENT = generateEvent();

  const defaultProps: CalendarEventProps = {
    event: {
      title: EVENT.title,
      start: new Date(DEFAULT_TEST_DATE),
      end: addHours(new Date(DEFAULT_TEST_DATE), 1),
      resource: {
        id: EVENT.id,
        type: "event",
        event: EVENT,
        tasks: [],
        journalEntries: [],
        habits: [],
        people: [],
      },
    },
  };

  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props = defaultProps) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <EventsContextProvider>
            <DndContext>
              <CalendarEvent {...props} />
            </DndContext>
          </EventsContextProvider>
        </TasksNewContextProvider>
      </ProjectsContextProvider>
    );

  it("should show event title", () => {
    renderComponent();
    expect(screen.getByText(EVENT.title)).toBeInTheDocument();
  });

  it("should show context menu options for a pending event", async () => {
    renderComponent();
    fireEvent.contextMenu(screen.getByText(EVENT.title));

    const options = (await screen.findAllByRole("menuitem")).map(
      (option) => option.textContent
    );

    expect(options).toStrictEqual([
      "Complete",
      "Move",
      "Cancel",
      "Edit",
      "Delete",
    ]);
  });

  describe("complete", () => {
    it("should send complete request", async () => {
      renderComponent();
      fireEvent.contextMenu(screen.getByText(EVENT.title));

      const completeButton = await screen.findByRole("menuitem", {
        name: "Complete",
      });
      fireEvent.click(completeButton);

      expect(mockAxios.patch).toHaveBeenCalledWith(getEventsPath(EVENT.id), {
        status: EventStatus.Completed,
      });
    });
  });

  describe("delete", () => {
    it("should send delete request", async () => {
      renderComponent();
      fireEvent.contextMenu(screen.getByText(EVENT.title));

      const deleteButton = await screen.findByRole("menuitem", {
        name: "Delete",
      });
      fireEvent.click(deleteButton);

      expect(mockAxios.delete).toHaveBeenCalledWith(getEventsPath(EVENT.id));
    });
  });

  describe("event is completed", () => {
    it('should not show "Complete" option', async () => {
      const completedEvent = generateEvent(1, {
        status: EventStatus.Completed,
      });
      const props: CalendarEventProps = {
        ...defaultProps,
        event: {
          ...defaultProps.event,
          resource: {
            ...defaultProps.event.resource,
            event: completedEvent,
          },
        },
      };

      renderComponent(props);
      fireEvent.contextMenu(screen.getByText(completedEvent.title));

      const options = (await screen.findAllByRole("menuitem")).map(
        (option) => option.textContent
      );

      expect(options).not.toContain("Complete");
    });
  });

  describe("event has tasks", () => {
    it("should number of tasks", () => {
      const tasks = generateListOfTasks(2);
      const props: CalendarEventProps = {
        ...defaultProps,
        event: {
          ...defaultProps.event,
          resource: { ...defaultProps.event.resource, tasks },
        },
      };

      renderComponent(props);

      expect(screen.getByText(tasks.length)).toBeInTheDocument();
    });
  });

  describe("event has habits", () => {
    it("should show habit titles", () => {
      const habits = [generateHabit(1), generateHabit(2)];
      const props: CalendarEventProps = {
        ...defaultProps,
        event: {
          ...defaultProps.event,
          resource: { ...defaultProps.event.resource, habits },
        },
      };

      renderComponent(props);

      expect(screen.getByText(habits.length)).toBeInTheDocument();
    });
  });
});
