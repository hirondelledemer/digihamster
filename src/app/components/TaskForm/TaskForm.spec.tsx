import { render, screen } from "@testing-library/react";
import TaskForm, { TaskFormProps } from "./TaskForm";
import { getTaskFormTestkit } from "./TaskForm.testkit";

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = {};
  const renderComponent = (props = defaultProps) =>
    getTaskFormTestkit(render(<TaskForm {...props} />).container);

  it("with all the inputs", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    screen.logTestingPlaygroundURL();
    expect(wrapper.getTitleInputExists()).toBe(true);
    expect(wrapper.getDesriptionInputExists()).toBe(true);
    expect(wrapper.getETAFieldExists()).toBe(true);
    expect(wrapper.getProjectFieldExists()).toBe(true);
    expect(wrapper.getCreateButtonExists()).toBe(true);
  });
});
