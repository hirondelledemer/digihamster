import { render, screen, act, waitFor } from "@testing-library/react";
import TaskForm, { TaskFormProps } from "./TaskForm";
import { getTaskFormTestkit } from "./TaskForm.testkit";
import { ObjectId } from "mongoose";
// import { act } from "react-dom/test-utils";

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = {
    projects: [1, 2].map((n) => ({
      _id: `project${n}` as unknown as ObjectId,
      title: `Project ${n}`,
      deleted: false,
      color: "",
      order: 0,
    })),
    onSubmit: jest.fn(),
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
      ...defaultProps,
      initialValues: {
        title: "title",
        description: "desription",
        eta: 1,
        project: "project1",
      },
    };
    const wrapper = renderComponent(props);
    expect(wrapper.getTitleInputValue()).toBe(props.initialValues!.title);
    expect(wrapper.getDescriptionInputValue()).toBe(
      props.initialValues!.description
    );
    expect(wrapper.getEtaInputValue()).toBe(`${props.initialValues!.eta}`);
    expect(wrapper.getProjectInputValue()).toBe(props.projects[0].title);
  });

  it.only("submits form", async () => {
    const onSubmitSpy = jest.fn();
    const props: TaskFormProps = {
      ...defaultProps,
      onSubmit: onSubmitSpy,
    };
    // act(() => {
    const wrapper = renderComponent(props);
    wrapper.setTitle("new title");
    // wrapper.setDescription("new desc");
    wrapper.setEta(2);
    wrapper.setProject(props.projects[0]._id as unknown as string);
    // console.log(wrapper.getOptionAt());
    expect(wrapper.optionExists("Project 1")).toBe(true);
    wrapper.clickOption("Project 1");
    screen.logTestingPlaygroundURL();
    wrapper.clickCreateButton();
    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledWith({});
    });
    // });
  });
});
