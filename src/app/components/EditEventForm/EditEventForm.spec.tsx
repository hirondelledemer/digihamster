import { act, render, screen, waitFor } from "@/config/utils/test-utils";
import EditEventForm, { EventFormProps } from "./EditEventForm";
import mockAxios from "jest-mock-axios";

import { generateEvent } from "@/app/utils/mocks/event";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { TasksNewContextProvider } from "@/app/utils/hooks/use-tasks-new/provider";
import { PROJECTS_PATH } from "@/app/utils/hooks/use-projects/api";
import { generateListOfProjects } from "@/app/utils/mocks/project";
import { TASKS_PATH } from "@/app/utils/hooks/use-tasks-new/api";
import { EVENTS_PATH, getEventsPath } from "@/app/utils/hooks/use-events/api";
import { userEvent } from "@storybook/test";
import { generateCustomTasksList } from "@/app/utils/mocks/task";

const PROJECTS = generateListOfProjects(3);
const EVENT = generateEvent(1, { project_id: PROJECTS[1].id });
const TASKS = generateCustomTasksList([
  { event_id: EVENT.id },
  { event_id: EVENT.id },
  { event_id: null },
]);

const DEFAULT_PROPS: EventFormProps = {
  onDone: jest.fn(),
  event: EVENT,
};

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(3));
  await act(async () => {
    mockAxios.mockResponseFor({ url: PROJECTS_PATH }, { data: PROJECTS });
    mockAxios.mockResponseFor({ url: TASKS_PATH }, { data: TASKS });
    mockAxios.mockResponseFor({ url: EVENTS_PATH }, { data: [] });
  });
  // await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("EditEventForm", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const renderComponent = (props: EventFormProps = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <EventsContextProvider>
          <TasksNewContextProvider>
            <EditEventForm {...props} />
          </TasksNewContextProvider>
        </EventsContextProvider>
      </ProjectsContextProvider>,
    );

  it("shows all the inputs", async () => {
    renderComponent();

    await assertLoaded();

    expect(screen.getByRole("textbox", { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      EVENT.title,
    );
    expect(
      screen.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      EVENT.description,
    );
    expect(
      screen.getByRole("combobox", { name: /project/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /project/i }),
    ).toHaveTextContent(PROJECTS[1].title);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("edits event", async () => {
    renderComponent();

    assertLoaded();

    await userEvent.type(
      screen.getByRole("textbox", { name: /title/i }),
      " edited",
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      " edited",
    );

    await userEvent.click(screen.getByRole("combobox", { name: /project/i }));
    await userEvent.click(screen.getAllByRole("option")[2]);

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledWith(getEventsPath(EVENT.id), {
        description: "event description 1 edited",
        project_id: 2,
        title: "Event 1 edited",
      });
    });
  });

  it("should render the tasks", async () => {
    renderComponent();

    await assertLoaded();

    expect(screen.getByText(TASKS[0].title)).toBeInTheDocument();
    expect(screen.getByText(TASKS[1].title)).toBeInTheDocument();
  });
});
