import { render, screen } from "@/config/utils/test-utils";
import ProjectCard, { ProjectCardProps } from "./ProjectCard";
import { getProjectCardTestkit } from "./ProjectCard.testkit";
import { generateProject } from "@/app/utils/mocks/project";
import { wrapWithTasksProvider } from "@/app/utils/tests/wraps";
import { generateCustomTasksList } from "@/app/utils/mocks/task";

// todo: check if testkit is needed
describe("ProjectCard", () => {
  const defaultProps: ProjectCardProps = {
    project: generateProject(),
    selected: false,
  };

  const defaultTasks = generateCustomTasksList([
    {
      projectId: defaultProps.project._id,
      estimate: 2,
      completed: true,
    },
    {
      estimate: 2,
      projectId: defaultProps.project._id,
    },
    {
      estimate: 2,
      projectId: defaultProps.project._id,
    },
  ]);

  const renderComponent = (props = defaultProps, tasks = defaultTasks) =>
    getProjectCardTestkit(
      render(
        wrapWithTasksProvider(<ProjectCard {...props} />, {
          data: tasks,
        })
      ).container
    );

  it("should render ProjectCard", () => {
    renderComponent();
    expect(screen.getByText(defaultProps.project.title)).toBeInTheDocument();
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

  // completed project -> all tasks is the project are completed
  describe("project is completed", () => {
    const tasks = generateCustomTasksList([
      {
        projectId: defaultProps.project._id,
        estimate: 2,
        completed: true,
      },
      {
        estimate: 2,
        projectId: defaultProps.project._id,
        completed: true,
      },
      {
        estimate: 2,
        projectId: defaultProps.project._id,
        completed: true,
      },
    ]);

    it("should not show progress bar", () => {
      renderComponent(defaultProps, tasks);
      expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    });

    it("should not show completed tasks count", () => {
      const wrapper = renderComponent(defaultProps, tasks);
      screen.logTestingPlaygroundURL();
      expect(wrapper.getComponent().textContent).toBe("Project 1");
    });

    it("should show completed icon", () => {
      renderComponent(defaultProps, tasks);
      expect(screen.getByTestId("completed-icon")).toBeInTheDocument();
    });
  });

  describe("project is disabled", () => {
    const props: ProjectCardProps = {
      project: generateProject(0, { disabled: true }),
      selected: false,
    };

    it("should not show progress bar", () => {
      renderComponent(props);
      expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    });

    it("should not show completed tasks count", () => {
      const wrapper = renderComponent(props);
      screen.logTestingPlaygroundURL();
      expect(wrapper.getComponent().textContent).toBe("Project 0");
    });

    it("should show disabled icon", () => {
      renderComponent(props);
      expect(screen.queryByTestId("completed-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("disabled-icon")).toBeInTheDocument();
    });
  });
});
