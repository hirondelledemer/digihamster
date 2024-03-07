import { render } from "@testing-library/react";
import ActiveTaskList, { ActiveTaskListProps } from "./ActiveTaskList";
import { getActiveTaskListTestkit } from "./ActiveTaskList.testkit";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";
import { TasksContext } from "@/app/utils/hooks/use-tasks";

describe("ActiveTaskList", () => {
  const tasks = generateListOfTasks(3);
  const defaultProps: ActiveTaskListProps = {};

  const renderComponent = (props = defaultProps) =>
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

  it("renders 3 tasks", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTasksCount()).toBe(3);
    expect(wrapper.getTaskTitleAt(0)).toBe(tasks[0].title);
    expect(wrapper.getTaskTitleAt(1)).toBe(tasks[1].title);
    expect(wrapper.getTaskTitleAt(2)).toBe(tasks[2].title);
  });
});
