import { render } from "@testing-library/react";
import ActiveTaskList, { ActiveTaskListProps } from "./ActiveTaskList";
import { getActiveTaskListTestkit } from "./ActiveTaskList.testkit";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { TasksContext } from "@/app/utils/hooks/use-tasks";

// todo: test isActive AND tasks with deadline are shown

describe("ActiveTaskList", () => {
  const defaultTasks = generateCustomTasksList([
    { isActive: true },
    { isActive: true },
    { isActive: true },
    { isActive: false },
  ]);
  const defaultProps: ActiveTaskListProps = {};

  const renderComponent = (props = defaultProps, tasks = defaultTasks) =>
    getActiveTaskListTestkit(
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
          <TasksContext.Provider
            value={{
              data: tasks,
              loading: false,
              setData: jest.fn(),
            }}
          >
            <ActiveTaskList {...props} />
          </TasksContext.Provider>
        </ProjectsContext.Provider>
      ).container
    );

  it("renders active tasks tasks", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTasksCount()).toBe(3);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(defaultTasks[1].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[2].title);
  });

  it('should render tasks in order "not completed" -> "completed"', () => {
    const tasks = generateCustomTasksList([
      { completed: false },
      { completed: true },
      { completed: false },
    ]);
    const wrapper = renderComponent(defaultProps, tasks);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(defaultTasks[2].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[1].title);
  });
});
