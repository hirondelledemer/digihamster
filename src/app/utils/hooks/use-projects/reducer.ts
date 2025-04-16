import { arrayMove } from "@dnd-kit/sortable";
import { updateObjById } from "../../common/update-array";
import {
  ProjectsState,
  ProjectsStateAction,
  ProjectsStateActionType,
} from "./actions";

import { Project } from "@/models/project";

export function reducer(state: ProjectsState, action: ProjectsStateAction) {
  switch (action.type) {
    case ProjectsStateActionType.StartLoading: {
      return {
        ...state,
        isLoading: true,
        data: [],
        defaultProject: null,
      };
    }
    case ProjectsStateActionType.FinishLoading: {
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        defaultProject: action.payload.defaultProject,
      };
    }
    case ProjectsStateActionType.Error: {
      return {
        ...state,
        isLoading: false,
        data: [],
        defaultProject: null,
        errorMessage: action.payload.errorMessage,
      };
    }
    case ProjectsStateActionType.CreateProject: {
      return {
        ...state,
        isLoading: true,
        data: [...state.data, action.payload.project],
      };
    }
    case ProjectsStateActionType.UpdateProject: {
      return {
        ...state,
        isLoading: false,
        data: updateObjById<Project>(
          state.data,
          action.payload.id,
          action.payload.project
        ),
      };
    }
    case ProjectsStateActionType.DeleteProject: {
      return {
        ...state,
        isLoading: false,
        data: state.data.filter((project) => project._id !== action.payload.id),
      };
    }
    case ProjectsStateActionType.UpdateOrder: {
      const oldIndex = state.data.findIndex(
        (p) => p._id === action.payload.movedProjectId
      );
      const newIndex = state.data.findIndex(
        (p) => p._id === action.payload.overProjectId
      );

      return {
        ...state,
        isLoading: false,
        data: arrayMove(state.data, oldIndex, newIndex),
      };
    }
    default: {
      throw Error("Unknown action");
    }
  }
}
