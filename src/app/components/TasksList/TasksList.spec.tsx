import { render } from "@testing-library/react";
import TasksList, { TasksListProps } from "./TasksList";
import { getTasksListTestkit } from "./TasksList.testkit";
import { generateListOfTasks } from "@/app/utils/mocks/task";
import { wrapWithProjectsProvider } from "@/app/utils/tests/wraps";

describe("TasksList", () => {
  const tasks = generateListOfTasks(2);
  const defaultProps: TasksListProps = {
    data: tasks,
  };
  const renderComponent = (props = defaultProps) =>
    getTasksListTestkit(
      render(
        wrapWithProjectsProvider(<TasksList {...props} />, { projects: [] })
      ).container
    );

  it("should render TasksList", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
