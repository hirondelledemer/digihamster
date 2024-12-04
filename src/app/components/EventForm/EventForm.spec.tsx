import { render, waitFor } from "@/config/utils/test-utils";
import EventForm, { EventFormProps } from "./EventForm";
import { getEventFormTestkit } from "./EventForm.testkit";
import { wrapWithProjectsProvider } from "@/app/utils/tests/wraps";
import mockAxios from "jest-mock-axios";
import { HOUR } from "@/app/utils/consts/dates";
import { generateEvent } from "@/app/utils/mocks/event";

describe("EventForm", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const defaultProps: EventFormProps = {
    editMode: false,
    onDone: jest.fn(),
  };

  const projects = [1, 2].map((n) => ({
    _id: `project${n}`,
    title: `Project ${n}`,
    deleted: false,
    color: "",
    order: 0,
  }));

  const renderComponent = (props: EventFormProps = defaultProps) =>
    getEventFormTestkit(
      render(wrapWithProjectsProvider(<EventForm {...props} />)).container
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
    const props: EventFormProps = {
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
    const newTitle = "new title";
    const newDescription = "new desc";

    const props: EventFormProps = {
      ...defaultProps,

      initialValues: {
        title: "",
        description: "",
        project: projects[0]._id as unknown as string,
        startAt: 0,
        endAt: HOUR,
      },
    };
    const wrapper = renderComponent(props);
    wrapper.setTitle(newTitle);
    await wrapper.setDescription(newDescription);

    wrapper.clickCreateButton();
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith("/api/events", {
        description: newDescription,
        projectId: "project1",
        title: newTitle,
        allDay: false,
        endAt: HOUR,
        startAt: 0,
      });
    });
  });

  describe("editMode", () => {
    it("should show edit mode", () => {
      const eventToEdit = generateEvent();
      const props: EventFormProps = {
        editMode: true,
        onDone: jest.fn(),
        event: eventToEdit,
      };
      const wrapper = renderComponent(props);
      expect(wrapper.getCreateButtonExists()).toBe(false);
      expect(wrapper.getEditButtonExists()).toBe(true);
    });
  });
});
