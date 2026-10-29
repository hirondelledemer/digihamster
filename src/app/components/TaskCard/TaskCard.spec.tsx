import TaskCard, { cardTestId, titleTestId, TaskCardProps } from "./TaskCard";
import { generateTask } from "@/app/utils/mocks/task";
import { generateProject } from "@/app/utils/mocks/project";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@/config/utils/test-utils";

import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksContextProvider } from "@/app/utils/hooks/use-tasks/provider";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import { toBackendDateTime } from "#utils/date";
import { now } from "@/app/utils/date/now";
import { subDays } from "date-fns";
import { TooltipProvider } from "../ui/tooltip";
import {
  CalendarDateContextProvider,
  useCalendarDate,
} from "@/app/utils/hooks/use-calendar-date";
import { DraggableAttributes } from "@dnd-kit/core";
import { RelationshipsContextProvider } from "@/app/utils/hooks/use-relationships/provider";
import { NotesContextProvider } from "@/app/utils/hooks/use-notes/provider";
import { RELATIONSHIPS_PATH } from "@/app/utils/hooks/use-relationships/api";
import { NOTES_PATH } from "@/app/utils/hooks/use-notes/api";
import { generateNote } from "@/app/utils/mocks/note";
import { generateRelationship } from "@/app/utils/mocks/relationship";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

jest.mock("../../utils/date/now");
jest.mock("next/navigation");

const selectedDateTestId = "selected-date-testid";

const SelectedDateProbe = () => {
  const { selectedDate } = useCalendarDate();
  return (
    <div data-testid={selectedDateTestId}>{selectedDate.toISOString()}</div>
  );
};

describe("TaskCard", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const DEFAULT_PROJECT = generateProject();
  const DEFAULT_PROJECTS = [DEFAULT_PROJECT];
  const DEFAULT_TASK = generateTask(1, { project_id: DEFAULT_PROJECT.id });

  const DEFAULT_PROPS: TaskCardProps = {
    task: DEFAULT_TASK,
  };

  /**
   * The projects request is fired by the provider on mount; the card only knows
   * its project once that request has resolved, so every render waits for it.
   */
  const resolveProjects = async (projects = DEFAULT_PROJECTS) => {
    // eslint-disable-next-line testing-library/prefer-find-by
    await waitFor(() =>
      expect(mockAxios.getReqByUrl(PROJECTS_PATH)).not.toBeNull()
    );

    await act(async () => {
      mockAxios.mockResponseFor({ url: PROJECTS_PATH }, { data: projects });
    });
  };

  const renderComponent = async (props: TaskCardProps = DEFAULT_PROPS) => {
    render(
      <TooltipProvider>
        <CalendarDateContextProvider>
          <ProjectsContextProvider>
            <TasksContextProvider>
              <SelectedDateProbe />
              <TaskCard {...props} />
            </TasksContextProvider>
          </ProjectsContextProvider>
        </CalendarDateContextProvider>
      </TooltipProvider>
    );

    await resolveProjects();
  };

  const renderTask = (task: Partial<ITask>, props?: Partial<TaskCardProps>) =>
    renderComponent({
      ...DEFAULT_PROPS,
      task: generateTask(1, { project_id: DEFAULT_PROJECT.id, ...task }),
      ...props,
    });

  const getIcon = (name: string) =>
    document.querySelector(`.tabler-icon-${name}`);

  const openContextMenu = () =>
    fireEvent.contextMenu(screen.getByTestId(titleTestId));

  describe("content", () => {
    it("should show the task title and description", async () => {
      await renderComponent();

      expect(screen.getByText(DEFAULT_TASK.title)).toBeInTheDocument();
      expect(screen.getByText(DEFAULT_TASK.description!)).toBeInTheDocument();
    });

    it("should show the project of the task", async () => {
      await renderComponent();

      expect(screen.getByText(DEFAULT_PROJECT.title)).toBeInTheDocument();
    });

    it("should paint the card border in the project color", async () => {
      await renderComponent();

      expect(screen.getByTestId(cardTestId)).toHaveStyle({
        borderColor: DEFAULT_PROJECT.color,
      });
    });

    it("should render a task without a project", async () => {
      await renderTask({ project_id: null });

      expect(screen.getByText(DEFAULT_TASK.title)).toBeInTheDocument();
      expect(screen.queryByText(DEFAULT_PROJECT.title)).not.toBeInTheDocument();
    });

    it("should render a task without a description", async () => {
      await renderTask({ description: null });

      expect(screen.getByText(DEFAULT_TASK.title)).toBeInTheDocument();
      expect(
        screen.queryByText(DEFAULT_TASK.description!)
      ).not.toBeInTheDocument();
    });
  });

  describe("task is not completed", () => {
    it("should show the card without opacity and strike through", async () => {
      await renderComponent();

      const card = screen.getByTestId(cardTestId);

      expect(card.className).not.toContain("opacity-40");
      expect(card.className).not.toContain("line-through");
    });
  });

  describe("task is completed", () => {
    const COMPLETED_TASK = generateTask(1, {
      status: TaskStatus.Done,
      project_id: DEFAULT_PROJECT.id,
    });

    it("should show the card with opacity and strike through", async () => {
      await renderComponent({ task: COMPLETED_TASK });

      const card = screen.getByTestId(cardTestId);

      expect(card.className).toContain("opacity-40");
      expect(card.className).toContain("line-through");
    });

    it("should hide the description", async () => {
      await renderComponent({ task: COMPLETED_TASK });

      expect(screen.getByText(COMPLETED_TASK.title)).toBeInTheDocument();
      expect(
        screen.queryByText(COMPLETED_TASK.description!)
      ).not.toBeInTheDocument();
    });
  });

  describe("active task indication", () => {
    it("should show the active icon when the task is being done", async () => {
      await renderTask({ status: TaskStatus.Doing }, { indicateActive: true });

      expect(getIcon("progress-check")).toBeInTheDocument();
    });

    it("should not show the active icon when the task is not being done", async () => {
      await renderTask({ status: TaskStatus.Todo }, { indicateActive: true });

      expect(getIcon("progress-check")).not.toBeInTheDocument();
    });

    it("should not show the active icon when indication is off", async () => {
      await renderTask({ status: TaskStatus.Doing });

      expect(getIcon("progress-check")).not.toBeInTheDocument();
    });
  });

  describe("stale indicator", () => {
    it("should show the stale indicator for a task activated long ago", async () => {
      await renderTask({
        status: TaskStatus.Doing,
        activated_at: toBackendDateTime(subDays(now(), 10)),
      });

      expect(screen.getByTestId("dinosaur-icon")).toBeInTheDocument();
    });

    it("should not show the stale indicator for a freshly activated task", async () => {
      await renderTask({
        status: TaskStatus.Doing,
        activated_at: toBackendDateTime(now()),
      });

      expect(screen.queryByTestId("dinosaur-icon")).not.toBeInTheDocument();
    });

    it("should not show the stale indicator for a task that is not being done", async () => {
      await renderTask({
        status: TaskStatus.Todo,
        activated_at: toBackendDateTime(subDays(now(), 10)),
      });

      expect(screen.queryByTestId("dinosaur-icon")).not.toBeInTheDocument();
    });
  });

  describe("task has a deadline", () => {
    const DEADLINE = "1970-01-20T00:00:00.000Z";

    it("should show the deadline icon", async () => {
      await renderTask({ deadline: DEADLINE });

      expect(getIcon("calendar")).toBeInTheDocument();
    });

    it("should not show the deadline icon when there is no deadline", async () => {
      await renderTask({ deadline: null });

      expect(getIcon("calendar")).not.toBeInTheDocument();
    });

    it("should select the deadline date in the calendar on click", async () => {
      await renderTask({ deadline: DEADLINE });

      fireEvent.click(getIcon("calendar")!);

      expect(screen.getByTestId(selectedDateTestId)).toHaveTextContent(
        DEADLINE
      );
    });
  });

  describe("context menu", () => {
    it("should open the task actions on right click", async () => {
      await renderComponent();

      openContextMenu();

      expect(await screen.findAllByRole("menuitem")).not.toHaveLength(0);
    });
  });

  // the card is rendered from eight places - the task list, the calendar, the
  // event form, the habit card, the relationship navigator. A note attached to
  // a task has to show in all of them, not only the one that happens to walk
  // the relationship graph.
  describe("attached notes", () => {
    const NOTE = generateNote(3);

    const renderWithNotes = async (relationships: unknown[]) => {
      render(
        <TooltipProvider>
          <CalendarDateContextProvider>
            <ProjectsContextProvider>
              <TasksContextProvider>
                <NotesContextProvider>
                  <RelationshipsContextProvider>
                    <TaskCard {...DEFAULT_PROPS} />
                  </RelationshipsContextProvider>
                </NotesContextProvider>
              </TasksContextProvider>
            </ProjectsContextProvider>
          </CalendarDateContextProvider>
        </TooltipProvider>
      );

      await resolveProjects();
      await act(async () => {
        mockAxios.mockResponseFor({ url: NOTES_PATH }, { data: [NOTE] });
      });
      await act(async () => {
        mockAxios.mockResponseFor(
          { url: RELATIONSHIPS_PATH },
          { data: relationships }
        );
      });
    };

    const noteOnTask = (taskId: number) =>
      generateRelationship(1, {
        source_type: RelationshipEntityType.Note,
        source_id: NOTE.id,
        target_type: RelationshipEntityType.Task,
        target_id: taskId,
      });

    it("should show a note attached to the task", async () => {
      await renderWithNotes([noteOnTask(DEFAULT_PROPS.task.id)]);

      expect(await screen.findByText(NOTE.content)).toBeInTheDocument();
    });

    it("should not show a note attached to some other task", async () => {
      await renderWithNotes([noteOnTask(DEFAULT_PROPS.task.id + 1)]);

      expect(screen.queryByText(NOTE.content)).not.toBeInTheDocument();
    });
  });

  describe("drag and drop", () => {
    it("should wire the drag handle up to the card", async () => {
      const setNodeRef = jest.fn();
      const onPointerDown = jest.fn();
      const attributes: DraggableAttributes = {
        role: "button",
        tabIndex: 0,
        "aria-disabled": false,
        "aria-pressed": undefined,
        "aria-roledescription": "draggable",
        "aria-describedby": "DndDescribedBy-0",
      };

      await renderComponent({
        ...DEFAULT_PROPS,
        testId: "task-card-testid",
        setNodeRef,
        listeners: { onPointerDown },
        attributes,
        style: { opacity: 0.5 },
      });

      const card = screen.getByTestId(cardTestId);

      expect(screen.getByTestId("task-card-testid")).toBeInTheDocument();
      expect(setNodeRef).toHaveBeenCalledWith(card);
      expect(card).toHaveAttribute("aria-roledescription", "draggable");
      expect(card).toHaveStyle({ opacity: "0.5" });

      fireEvent.pointerDown(card);
      expect(onPointerDown).toHaveBeenCalled();
    });
  });
});
