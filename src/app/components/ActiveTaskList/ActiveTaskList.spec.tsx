import { render } from "@testing-library/react";
import ActiveTaskList, { ActiveTaskListProps } from "./ActiveTaskList";
import { getActiveTaskListTestkit } from "./ActiveTaskList.testkit";
import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { TasksContext } from "@/app/utils/hooks/use-tasks";

describe("ActiveTaskList", () => {
  const defaultTasks = generateCustomTasksList([
    { isActive: true },
    { isActive: true },
    { isActive: true },
    { isActive: false },
    { isActive: false, deadline: 1100000 },
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

  it("renders active tasks and tasks with deadline", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTasksCount()).toBe(4);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(defaultTasks[1].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[2].title);
    expect(wrapper.getTaskTitleAt(3)).toBe(`${defaultTasks[4].title}01-01`);
  });

  it('should render tasks in order "not completed" -> "completed"', () => {
    const tasks = generateCustomTasksList([
      { completed: false, isActive: true },
      { completed: true, isActive: true },
      { completed: false, deadline: 1100000, isActive: true },
      { completed: false, isActive: true },
    ]);

    const wrapper = renderComponent(defaultProps, tasks);
    expect(wrapper.getTaskTitleAt(0)).toBe(defaultTasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(`${defaultTasks[2].title}01-01`);
    expect(wrapper.getTaskTitleAt(2)).toBe(defaultTasks[3].title);
    expect(wrapper.getTaskTitleAt(3)).toBe(defaultTasks[1].title);
  });
});
