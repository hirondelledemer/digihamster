import { render, screen } from "@/config/utils/test-utils";
import ProjectCard, { ProjectCardProps } from "./ProjectCard";
import { generateProject } from "@/app/utils/mocks/project";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { TaskStatus } from "@/app/utils/types/task";
import { eventsState, providers, tasksState } from "@/app/utils/tests/wrappers";
import { ProjectStatus } from "@/app/utils/types/project";
import { generateCustomEventList } from "@/app/utils/mocks/event";
import { EventStatus, IEvent } from "@/app/utils/types/event";

describe("ProjectCard", () => {
  const PROJECT = generateProject(1, { status: ProjectStatus.Doing });
  const DEFAULT_PROPS: ProjectCardProps = {
    project: PROJECT,
    selected: false,
  };

  const TASKS = generateCustomTasksList([
    {
      project_id: DEFAULT_PROPS.project.id,
      status: TaskStatus.Done,
    },
    {
      project_id: DEFAULT_PROPS.project.id,
      status: TaskStatus.Doing,
    },
    {
      project_id: DEFAULT_PROPS.project.id,
      status: TaskStatus.Doing,
    },
  ]);

  const renderComponent = (
    props = DEFAULT_PROPS,
    tasks = TASKS,
    events: IEvent[] = []
  ) =>
    render(<ProjectCard {...props} />, {
      wrapper: providers(
        tasksState({ data: tasks }),
        eventsState({ data: events })
      ),
    });

  it("should render ProjectCard", () => {
    renderComponent();
    expect(screen.getByText(DEFAULT_PROPS.project.title)).toBeInTheDocument();
  });

  it("should show progress bar", () => {
    renderComponent();
    expect(screen.getByTestId("progress-bar-outer").style.width).toBe("100%");
    expect(screen.getByTestId("progress-bar-inner").style.width).toBe(
      "33.33333333333333%"
    );
  });

  it("should show the task counter", () => {
    renderComponent();
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("should not show 'completed' icon", () => {
    renderComponent();
    expect(screen.queryByTestId("completed-icon")).not.toBeInTheDocument();
  });

  describe("project has events attached", () => {
    const EVENTS = generateCustomEventList([
      { status: EventStatus.Completed, project_id: PROJECT.id },
    ]);

    it("should show progress bar", () => {
      renderComponent(DEFAULT_PROPS, TASKS, EVENTS);
      expect(screen.getByTestId("progress-bar-outer").style.width).toBe("100%");
      expect(screen.getByTestId("progress-bar-inner").style.width).toBe("50%");
    });

    it("should show the task and event counters", () => {
      renderComponent(DEFAULT_PROPS, TASKS, EVENTS);
      expect(screen.getByText("1/3")).toBeInTheDocument();
      expect(screen.getByText("1/1")).toBeInTheDocument();
    });
  });

  describe("project is completed", () => {
    const COMPLETED_PROJECT = generateProject(1, {
      status: ProjectStatus.Done,
    });
    const PROPS = {
      ...DEFAULT_PROPS,
      project: COMPLETED_PROJECT,
    };

    it("should not show progress bar", () => {
      renderComponent(PROPS);
      expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    });

    it("should show completed icon", () => {
      renderComponent(PROPS);
      expect(screen.getByTestId("completed-icon")).toBeInTheDocument();
    });
  });

  describe("project is cancelled", () => {
    const PROPS: ProjectCardProps = {
      project: generateProject(0, { status: ProjectStatus.Cancelled }),
      selected: false,
    };

    it("should not show progress bar", () => {
      renderComponent(PROPS);
      expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    });

    it("should show cancelled icon", () => {
      renderComponent(PROPS);
      expect(screen.getByTestId("disabled-icon")).toBeInTheDocument();
    });
  });
});
