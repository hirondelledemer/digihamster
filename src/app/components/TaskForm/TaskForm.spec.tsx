import { render, screen } from "@testing-library/react";
import TaskForm, { TaskFormProps } from "./TaskForm";
import { getTaskFormTestkit } from "./TaskForm.testkit";
import { ObjectId } from "mongoose";

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = {
    projects: [],
  };
  const renderComponent = (props = defaultProps) =>
    getTaskFormTestkit(render(<TaskForm {...props} />).container);

  it("shows all the inputs", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTitleInputExists()).toBe(true);
    expect(wrapper.getDesriptionInputExists()).toBe(true);
    expect(wrapper.getETAFieldExists()).toBe(true);
    expect(wrapper.getProjectFieldExists()).toBe(true);
    expect(wrapper.getCreateButtonExists()).toBe(true);
  });

  it("shows initial values", () => {
    const props: TaskFormProps = {
      initialValues: {
        title: "title",
        description: "desription",
        eta: 1,
        project: "project1",
      },
      projects: [1, 2].map((n) => ({
        _id: `project${n}` as unknown as ObjectId,
        title: `Project ${n}`,
        deleted: false,
        color: "",
        order: 0,
      })),
    };
    const wrapper = renderComponent(props);
    expect(wrapper.getTitleInputValue()).toBe(props.initialValues!.title);
    expect(wrapper.getDescriptionInputValue()).toBe(
      props.initialValues!.description
    );
    expect(wrapper.getEtaInputValue()).toBe(`${props.initialValues!.eta}`);
    expect(wrapper.getProjectInputValue()).toBe(props.projects[0].title);
  });
});
