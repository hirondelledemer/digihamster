import { render } from "@testing-library/react";
import TasksList, { TasksListProps } from "./TasksList";
import { getTasksListTestkit } from "./TasksList.testkit";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";

describe("TasksList", () => {
  const tasks = generateListOfTasks(2);
  const defaultProps: TasksListProps = {
    data: tasks,
  };
  const renderComponent = (props = defaultProps) =>
    getTasksListTestkit(
      render(
        <ProjectsContextProvider>
          <TasksList {...props} />
        </ProjectsContextProvider>
      ).container
    );

  it("should render TasksList", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
