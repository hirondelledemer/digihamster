import { render, waitFor } from "@/config/utils/test-utils";
import TaskForm, { TaskFormProps } from "./EventForm";
import { getTaskFormTestkit } from "./EventForm.testkit";
import { wrapWithProjectsProvider } from "@/app/utils/tests/wraps";

describe("TaskForm", () => {
  const defaultProps: TaskFormProps = {
    onSubmit: jest.fn(),
  };

  const projects = [1, 2].map((n) => ({
    _id: `project${n}`,
    title: `Project ${n}`,
    deleted: false,
    color: "",
    order: 0,
  }));

  const renderComponent = (props = defaultProps) =>
    getTaskFormTestkit(
      render(wrapWithProjectsProvider(<TaskForm {...props} />)).container
    );

  it("shows all the inputs", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTitleInputExists()).toBe(true);
    expect(wrapper.getDesriptionInputExists()).toBe(true);
    expect(wrapper.getProjectFieldExists()).toBe(true);
    expect(wrapper.getCreateButtonExists()).toBe(true);
  });

  it("shows initial values", () => {
    const props: TaskFormProps = {
      ...defaultProps,
      initialValues: {
        title: "title",
        description: "content",
        project: "project1",
      },
    };
    const wrapper = renderComponent(props);

    expect(wrapper.getTitleInputValue()).toBe(props.initialValues!.title);
    expect(wrapper.getDescriptionInputValue()).toBe(
      props.initialValues!.description
    );

    expect(wrapper.getProjectInputValue()).toBe(projects[0].title);
  });

  // for some reason testing-library does not allow to select cobobox
  // heve project value is set as initial
  // todo: test this case in e2e

  it("submits form", async () => {
    const onSubmitSpy = jest.fn();
    const newTitle = "new title";
    const newDescription = "new desc";

    const props: TaskFormProps = {
      ...defaultProps,
      onSubmit: onSubmitSpy,
      initialValues: {
        title: "",
        description: "",
        project: projects[0]._id as unknown as string,
      },
    };
    const wrapper = renderComponent(props);
    wrapper.setTitle(newTitle);
    await wrapper.setDescription(newDescription);

    wrapper.clickCreateButton();
    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledWith({
        description: newDescription,
        project: "project1",
        title: newTitle,
      });
    });
  });

  describe("editMode", () => {
    it("should show edit mode", () => {
      const props: TaskFormProps = {
        ...defaultProps,
        editMode: true,
      };
      const wrapper = renderComponent(props);
      expect(wrapper.getCreateButtonExists()).toBe(false);
      expect(wrapper.getEditButtonExists()).toBe(true);
    });
  });
});
