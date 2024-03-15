import { render, waitFor } from "@testing-library/react";
import TaskForm, { TaskFormProps } from "./TaskForm";
import { getTaskFormTestkit } from "./TaskForm.testkit";
import { ProjectsContext } from "@/app/utils/hooks/use-projects";

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
      render(
        <ProjectsContext.Provider
          value={{
            data: projects,
            loading: false,
            setData: jest.fn(),
          }}
        >
          <TaskForm {...props} />
        </ProjectsContext.Provider>
      ).container
    );

  it("shows all the inputs", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
    expect(wrapper.getTitleInputExists()).toBe(true);
    expect(wrapper.getDesriptionInputExists()).toBe(true);
    expect(wrapper.getETAFieldExists()).toBe(true);
    expect(wrapper.getProjectFieldExists()).toBe(true);
    expect(wrapper.getCreateButtonExists()).toBe(true);
  });

  describe("showEta is false", () => {
    const props: TaskFormProps = {
      ...defaultProps,
      showEta: false,
    };

    it("should show all fields exept eta", () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getComponent()).not.toBe(null);
      expect(wrapper.getTitleInputExists()).toBe(true);
      expect(wrapper.getDesriptionInputExists()).toBe(true);
      expect(wrapper.getETAFieldExists()).toBe(false);
      expect(wrapper.getProjectFieldExists()).toBe(true);
      expect(wrapper.getCreateButtonExists()).toBe(true);
    });
  });

  it("shows initial values", () => {
    const props: TaskFormProps = {
      ...defaultProps,
      initialValues: {
        title: "title",
        description: "content",
        eta: 1,
        project: "project1",
      },
    };
    const wrapper = renderComponent(props);

    expect(wrapper.getTitleInputValue()).toBe(props.initialValues!.title);
    expect(wrapper.getDescriptionInputValue()).toBe(
      props.initialValues!.description
    );

    expect(wrapper.getEtaSelectedByName("eta-0")).toBe(false);
    expect(wrapper.getEtaSelectedByName("eta-1")).toBe(true);
    expect(wrapper.getEtaSelectedByName("eta-2")).toBe(false);
    expect(wrapper.getEtaSelectedByName("eta-3")).toBe(false);
    expect(wrapper.getEtaSelectedByName("eta-4")).toBe(false);
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
        eta: 0,
        project: projects[0]._id as unknown as string,
      },
    };
    const wrapper = renderComponent(props);
    wrapper.setTitle(newTitle);
    await wrapper.setDescription(newDescription);
    wrapper.setEta("eta-2");

    wrapper.clickCreateButton();
    await waitFor(() => {
      expect(onSubmitSpy).toHaveBeenCalledWith({
        description: newDescription,
        eta: 2,
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
