import { generateTask } from "@/app/utils/mocks/task";
import TodayEvent, { TodayEventProps } from "./TodayEvent";
import { fireEvent, render, screen } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { generateEvent } from "@/app/utils/mocks/event";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { getTasksPath } from "@/app/utils/hooks/use-tasks-new/api";
import { TaskStatus } from "@/app/utils/types/task";
import { addHours } from "date-fns";

describe("TodayEvent", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const EVENT = generateEvent();

  const DEFAULT_PROPS: TodayEventProps = {
    isFocused: false,
    event: {
      title: EVENT.title,
      start: new Date(DEFAULT_TEST_DATE),
      end: addHours(new Date(DEFAULT_TEST_DATE), 1),
      resource: {
        id: EVENT.id,
        type: "event",
        event: EVENT,
        tasks: [],
      },
    },
  };
  const renderComponent = (props = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <TasksNewContextProvider>
          <EventsContextProvider>
            <TodayEvent {...props} />
          </EventsContextProvider>
        </TasksNewContextProvider>
      </ProjectsContextProvider>,
    );

  describe("event is a task", () => {
    const TASK = generateTask(1, { deadline: DEFAULT_TEST_DATE });
    const TASK_PROPS: TodayEventProps = {
      isFocused: false,
      event: {
        title: TASK.title,
        start: new Date(DEFAULT_TEST_DATE),
        resource: {
          completed: false,
          id: TASK.id,
          type: "deadline",
          task: TASK,
        },
      },
    };

    it("should show actions", async () => {
      renderComponent(TASK_PROPS);

      fireEvent.contextMenu(screen.getByText(TASK.title));

      const options = (await screen.findAllByRole("menuitem")).map(
        (option) => option.textContent,
      );

      expect(options).toStrictEqual([
        "Add note",
        "Complete",
        "Activate",
        "Edit",
        "Move to the list",
      ]);
    });

    it("should move back to list", async () => {
      renderComponent(TASK_PROPS);

      fireEvent.contextMenu(screen.getByText(TASK.title));

      const moveBackToListItem = await screen.findByRole("menuitem", {
        name: /move to the list/i,
      });

      fireEvent.click(moveBackToListItem);

      expect(mockAxios.patch).toHaveBeenCalledWith(getTasksPath(TASK.id), {
        deadline: null,
        status: TaskStatus.Doing,
      });
    });
  });

  describe("event is not all day", () => {
    it("should show label with time", () => {
      renderComponent();

      expect(screen.getByText("10:10-11:10")).toBeInTheDocument();
    });

    it("should show title", () => {
      renderComponent();

      expect(screen.getByText(DEFAULT_PROPS.event.title)).toBeInTheDocument();
    });

    it("should show actions", async () => {
      renderComponent();
      fireEvent.contextMenu(screen.getByText(DEFAULT_PROPS.event.title));

      const options = (await screen.findAllByRole("menuitem")).map(
        (option) => option.textContent,
      );

      expect(options).toStrictEqual([
        "Complete",
        "Cancel",
        "Move", // TODO: moving cancels the event and creates the new one.
        "Delete",
        "Edit",
      ]);
    });
  });
});
