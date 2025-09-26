import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useProjectsState } from "./state-context";
import { ProjectsContextProvider } from "./provider";

import { generateListOfProjects } from "../../mocks/project";
import { Project } from "@/models/project";
import { useProjectsActions } from "./actions-context";

describe("ProjectsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch projects and update the state", async () => {
    const mockData = {
      projects: generateListOfProjects(3),
      defaultProject: null,
    };
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useProjectsState();
      console.log(data);
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((project: Project) => (
                <div key={project._id}>{project.title}</div>
              ))}
        </div>
      );
    };

    render(
      <ProjectsContextProvider>
        <TestComponent />
      </ProjectsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Project 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith("/api/projects");
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
      </ProjectsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
    expect(mockAxios.get).toHaveBeenCalledWith("/api/projects");
  });

  it("should create an project and update the state", async () => {
    const mockProject: Omit<Project, "_id"> = {
      title: "new project",
      deleted: false,
      color: "",
      disabled: false,
      jsonDescription: null,
      order: 0,
      category: "",
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
              <div key={project._id}>{project.title}</div>
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
      </ToastProvider>
    );

    expect(screen.queryByText("new project")).not.toBeInTheDocument();
    // Simulate clicking the "Create Project" button
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new project")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith("/api/projects", mockProject);
  });

  it("should delete an project and update the state", async () => {
    const mockData = {
      projects: generateListOfProjects(2),
      defaultProject: null,
    };

    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data } = useProjectsState();
      const { delete: deleteProject } = useProjectsActions();
      return (
        <div>
          <div>
            {data.map((project) => (
              <div key={project._id}>
                <div>{project.title}</div>
                <button onClick={() => deleteProject(project._id)}>
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
      </ToastProvider>
    );

    await expect(screen.findByText("Project 0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Project 1")).resolves.toBeInTheDocument();

    // Simulate clicking the "Create Project" button
    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("Project 1")).resolves.toBeInTheDocument()
    );
    expect(screen.queryByText("Project 0")).not.toBeInTheDocument();
    expect(mockAxios.patch).toHaveBeenCalledWith("/api/projects", {
      deleted: true,
      id: mockData.projects[0]._id,
    });
  });
});
