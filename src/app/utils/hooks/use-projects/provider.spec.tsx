import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useProjectsState } from "./state-context";
import { ProjectsContextProvider } from "./provider";

import { generateListOfProjects } from "../../mocks/project";
import { useProjectsActions } from "./actions-context";
import { IProject, ProjectStatus } from "../../types/project";
import { getProjectsPath, PROJECTS_PATH } from "./api";
import { DEFAULT_TEST_DATE } from "../../mocks/date";

const DEFAULT_PROJECTS = generateListOfProjects(3);

describe("ProjectsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch projects and update the state", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: DEFAULT_PROJECTS });

    const TestComponent = () => {
      const { data, isLoading } = useProjectsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((project: IProject) => (
                <div key={project.id}>{project.title}</div>
              ))}
        </div>
      );
    };

    render(
      <ProjectsContextProvider>
        <TestComponent />
      </ProjectsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Project 0")).resolves.toBeInTheDocument(),
    );
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(PROJECTS_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useProjectsState();
      return (
        <div>
          {isLoading ? (
            "Loading..."
          ) : (
            <div>Error: {errorMessage?.toString()}</div>
          )}
        </div>
      );
    };

    render(
      <ProjectsContextProvider>
        <TestComponent />
      </ProjectsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.get).toHaveBeenCalledWith(PROJECTS_PATH);
  });

  it("should create an project and update the state", async () => {
    const mockProject: Omit<IProject, "id"> = {
      title: "new project",
      color: "",
      life_aspect_id: 1,
      status: ProjectStatus.Todo,
      description: "",
      sort_order: 0,
      created_at: DEFAULT_TEST_DATE,
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useProjectsState();
      const { create: createProject } = useProjectsActions();
      return (
        <div>
          <button onClick={() => createProject(mockProject)}>
            Create Project
          </button>
          <div>
            {data.map((project) => (
              <div key={project.id}>{project.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <ProjectsContextProvider>
          <TestComponent />
        </ProjectsContextProvider>
      </ToastProvider>,
    );

    expect(screen.queryByText("new project")).not.toBeInTheDocument();
    // Simulate clicking the "Create Project" button
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new project")).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.post).toHaveBeenCalledWith(PROJECTS_PATH, mockProject);
  });

  it("should delete an project and update the state", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: DEFAULT_PROJECTS });

    const TestComponent = () => {
      const { data } = useProjectsState();
      const { delete: deleteProject } = useProjectsActions();
      return (
        <div>
          <div>
            {data.map((project) => (
              <div key={project.id}>
                <div>{project.title}</div>
                <button onClick={() => deleteProject(project.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <ProjectsContextProvider>
          <TestComponent />
        </ProjectsContextProvider>
      </ToastProvider>,
    );

    await expect(screen.findByText("Project 0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Project 1")).resolves.toBeInTheDocument();

    // Simulate clicking the "Create Project" button
    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("Project 1")).resolves.toBeInTheDocument(),
    );
    expect(screen.queryByText("Project 0")).not.toBeInTheDocument();
    expect(mockAxios.delete).toHaveBeenCalledWith(
      getProjectsPath(DEFAULT_PROJECTS[0].id),
    );
  });
});
