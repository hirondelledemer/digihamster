import TaskCard, { TaskCardProps } from "./TaskCard";
import { getTaskCardTestkit } from "./TaskCard.testkit";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { generateTask } from "@/app/utils/mocks/task";
import { render } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";

describe("TaskCard", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultTask = generateTask();
  const defaultProps: TaskCardProps = {
    task: defaultTask,
  };

  const renderComponent = (props = defaultProps) =>
    getTaskCardTestkit(
      render(
        <ProjectsContext.Provider
          value={{
            data: [
              {
                _id: "project1",
                title: "Project 1",
                deleted: false,
                color: "color1",
                order: 0,
              },
            ],
            loading: false,
            setData: jest.fn(),
          }}
        >
          <TaskCard {...props} />
        </ProjectsContext.Provider>
      ).container
    );

  it("should render TaskCard", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("shows task title, project name, description, tags", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent().textContent).toBe(
      "Task 1Project 1task description"
    );
  });

  describe("task is not completed", () => {
    it("should complete the task", async () => {
      const wrapper = renderComponent();
      wrapper.clickComplete();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/events", {
        completed: true,
        taskId: defaultTask._id,
      });
    });
  });

  describe("task is completed", () => {
    const task = generateTask({ completed: true });
    const props: TaskCardProps = {
      task,
    };
    it("should complete the task", async () => {
      const wrapper = renderComponent(props);
      wrapper.clickUndo();
      expect(mockAxios.patch).toHaveBeenCalledWith("/api/tasks/events", {
        completed: false,
        taskId: defaultTask._id,
      });
    });
  });
});
