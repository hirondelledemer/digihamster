import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@/config/utils/test-utils";
import ProjectForm, { ProjectFormProps } from "./ProjectForm";

import mockAxios from "jest-mock-axios";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { generateListOfLifeAspects } from "@/app/utils/mocks/lifeAspect";
import { LIFE_ASPECTS_WITH_BOOSTS_PATH } from "@/app/utils/hooks/use-life-aspects/api";
import {
  getProjectsPath,
  PROJECTS_PATH,
} from "@/app/utils/hooks/use-projects/api";
import { generateProject } from "@/app/utils/mocks/project";

const LIFE_ASPECTS = generateListOfLifeAspects(3);
const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(2));
  await act(async () => {
    mockAxios.mockResponseFor(
      { url: LIFE_ASPECTS_WITH_BOOSTS_PATH },
      { data: LIFE_ASPECTS },
    );
  });
};

const DEFAULT_PROPS = {
  editMode: false,
  initialValues: {},
  onDone: jest.fn(),
} as const satisfies ProjectFormProps;

describe("ProjectForm", () => {
  const renderComponent = (props: ProjectFormProps = DEFAULT_PROPS) =>
    render(
      <ProjectsContextProvider>
        <LifeAspectsContextProvider>
          <ProjectForm {...props} />
        </LifeAspectsContextProvider>
      </ProjectsContextProvider>,
    );

  afterEach(() => {
    mockAxios.reset();
  });

  it("should edit project", async () => {
    renderComponent();
    await assertLoaded();

    await userEvent.type(
      screen.getByRole("textbox", {
        name: /title/i,
      }),
      "Title",
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: /goal/i,
      }),
      "description",
    );

    await userEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(PROJECTS_PATH, {
        color: "#e11d48",
        description: "description",
        life_aspect_id: NaN,
        status: "todo",
        title: "Title",
      });
    });
  });

  it("should create project", async () => {
    const PROJECT = generateProject(1, { life_aspect_id: LIFE_ASPECTS[1].id });
    const EDIT_PROPS = {
      editMode: true,
      project: PROJECT,
      onDone: jest.fn(),
    } as const satisfies ProjectFormProps;

    renderComponent(EDIT_PROPS);
    await assertLoaded();

    await userEvent.type(
      screen.getByRole("textbox", {
        name: /title/i,
      }),
      "edited",
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: /goal/i,
      }),
      "edited",
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledWith(
        getProjectsPath(PROJECT.id),
        {
          color: "#FF6B6B",
          description: "Project description 1edited",
          life_aspect_id: 1,
          status: "todo",
          title: "Project 1edited",
        },
      );
    });
  });
});
