import { render, screen } from "@testing-library/react";
import ActiveTaskList, { ActiveTaskListProps } from "./ActiveTaskList";
import { getActiveTaskListTestkit } from "./ActiveTaskList.testkit";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";

describe("ActiveTaskList", () => {
  const tasks = generateListOfTasks(3);
  const defaultProps: ActiveTaskListProps = {
    tasks,
  };

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
          <ActiveTaskList {...props} />
        </ProjectsContext.Provider>
      ).container
    );

  it("renders 3 tasks", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    screen.logTestingPlaygroundURL();
    expect(wrapper.getTasksCount()).toBe(3);
  });
});
