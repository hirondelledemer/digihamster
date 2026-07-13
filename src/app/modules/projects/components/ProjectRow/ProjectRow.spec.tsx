import { generateProject } from "@/app/utils/mocks/project";
import { render, screen } from "@testing-library/react";
import { ProjectRow } from "./ProjectRow";
import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import mockAxios from "jest-mock-axios";
import { generateLifeAspect } from "@/app/utils/mocks/lifeAspect";
import userEvent from "@testing-library/user-event";
import { ProjectsContextProvider } from "@/app/utils/hooks/use-projects/provider";
import { getProjectsPath } from "@/app/utils/hooks/use-projects/api";
import { ProjectStatus } from "@/app/utils/types/project";

describe("ProjectRow", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  const LIFE_ASPECT_ID = 1;
  const PROJECTS_ID = 1;
  const LIFE_ASPECT = generateLifeAspect(LIFE_ASPECT_ID);
  const PROJECT = generateProject(PROJECTS_ID, {
    life_aspect_id: LIFE_ASPECT_ID,
  });

  it("should show project data", async () => {
    mockAxios.get.mockResolvedValue({ data: [LIFE_ASPECT] });

    render(
      <LifeAspectsContextProvider>
        <ProjectRow project={PROJECT} selected={false} onSelect={jest.fn()} />,
      </LifeAspectsContextProvider>,
    );

    // title
    await expect(screen.findByText(PROJECT.title)).resolves.toBeInTheDocument();

    // life aspect

    expect(screen.getByText(LIFE_ASPECT.title)).toBeInTheDocument();

    // status
    expect(screen.getByRole("radio", { name: "Todo" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Todo" })).toBeChecked();

    expect(
      screen.getByRole("radio", { name: "In Progress" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "In Progress" }),
    ).not.toBeChecked();

    expect(screen.getByRole("radio", { name: "Done" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Done" })).not.toBeChecked();

    expect(screen.getByRole("radio", { name: "Canceled" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Canceled" })).not.toBeChecked();
  });

  it("should edit the project", async () => {
    mockAxios.get.mockResolvedValue({ data: [LIFE_ASPECT] });

    render(
      <LifeAspectsContextProvider>
        <ProjectsContextProvider>
          <ProjectRow project={PROJECT} selected={false} onSelect={jest.fn()} />
        </ProjectsContextProvider>
      </LifeAspectsContextProvider>,
    );

    // assert loaded
    await expect(screen.findByText(PROJECT.title)).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("textbox");

    await userEvent.click(input);
    await userEvent.keyboard(" edited[Enter]");

    expect(mockAxios.patch).toHaveBeenCalledWith(getProjectsPath(PROJECTS_ID), {
      title: "Project 1 edited",
    });
  });

  it("should delete the project", async () => {
    mockAxios.get.mockResolvedValue({ data: [LIFE_ASPECT] });

    render(
      <LifeAspectsContextProvider>
        <ProjectsContextProvider>
          <ProjectRow project={PROJECT} selected={false} onSelect={jest.fn()} />
        </ProjectsContextProvider>
      </LifeAspectsContextProvider>,
    );

    // assert loaded
    await expect(screen.findByText(PROJECT.title)).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockAxios.delete).toHaveBeenCalledWith(getProjectsPath(PROJECTS_ID));
  });

  it("should change the project status", async () => {
    mockAxios.get.mockResolvedValue({ data: [LIFE_ASPECT] });

    render(
      <LifeAspectsContextProvider>
        <ProjectsContextProvider>
          <ProjectRow project={PROJECT} selected={false} onSelect={jest.fn()} />
        </ProjectsContextProvider>
      </LifeAspectsContextProvider>,
    );

    // assert loaded
    await expect(screen.findByText(PROJECT.title)).resolves.toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: "In Progress" }));

    expect(mockAxios.patch).toHaveBeenCalledWith(getProjectsPath(PROJECTS_ID), {
      status: ProjectStatus.Doing,
    });
  });
});
