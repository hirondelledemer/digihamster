import { generateListOfProjects, generateProject } from "../../mocks/project";
import {
  CreateProjectAction,
  DeleteProjectAction,
  ProjectsErrorAction,
  ProjectsFinishLoadingAction,
  ProjectsLoadAction,
  ProjectsStateActionType,
  UpdateProjectAction,
} from "./actions";
import { reducer } from "./reducer";

describe("ProjectsContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
      defaultProject: null,
    };
    const action: ProjectsLoadAction = {
      type: ProjectsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
      defaultProject: null,
      errorMessage: undefined,
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = {
      isLoading: true,
      data: [],
      errorMessage: undefined,
      defaultProject: null,
    };
    const mockData = generateListOfProjects(3);
    const action: ProjectsFinishLoadingAction = {
      type: ProjectsStateActionType.FinishLoading,
      payload: { data: mockData, defaultProject: mockData[0] },
    };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      isLoading: false,
      data: mockData,
      defaultProject: mockData[0],
      errorMessage: undefined,
    });
  });

  it("should handle ERROR action", () => {
    const initialState = {
      isLoading: true,
      data: [],
      errorMessage: undefined,
      defaultProject: null,
    };
    const errorMessage = "Failed to fetch projects";
    const action: ProjectsErrorAction = {
      type: ProjectsStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
      defaultProject: null,
    });
  });

  it("should handle CREATE_PROJECT action", () => {
    const initialState = {
      isLoading: true,
      data: [],
      errorMessage: undefined,
      defaultProject: null,
    };
    const project = generateProject();

    const action: CreateProjectAction = {
      type: ProjectsStateActionType.CreateProject,
      payload: { project },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [project],
      defaultProject: null,
      errorMessage: undefined,
    });
  });

  it("should handle UPDATE_PROJECT action", () => {
    const tempId = "new-id";
    const project = generateProject(0, { _id: tempId });
    const initialState = {
      isLoading: true,
      data: [project],
      errorMessage: undefined,
      defaultProject: null,
    };

    const editedData = { title: "edited project" };
    const editedProject = { ...project, title: "edited project" };

    const action: UpdateProjectAction = {
      type: ProjectsStateActionType.UpdateProject,
      payload: { project: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedProject],
      defaultProject: null,
      errorMessage: undefined,
    });
  });

  it("should handle DELETE_PROJECT action", () => {
    const projects = generateListOfProjects(2);
    const initialState = {
      isLoading: true,
      data: projects,
      errorMessage: undefined,
      defaultProject: null,
    };

    const idToDelete = projects[0]._id;

    const action: DeleteProjectAction = {
      type: ProjectsStateActionType.DeleteProject,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [projects[1]],
      defaultProject: null,
      errorMessage: undefined,
    });
  });
});
