import { render } from "@testing-library/react";
import Tasks, { TasksProps } from "./Tasks";
import { getTasksTestkit } from "./Tasks.testkit";

describe("Tasks", () => {
  const defaultProps: TasksProps = {};
  const renderComponent = (props = defaultProps) =>
    getTasksTestkit(render(<Tasks {...props} />).container);

  it("should render Tasks", () => {
    const { getComponent } = renderComponent();
    expect(getComponent()).not.toBe(null);
  });
});
