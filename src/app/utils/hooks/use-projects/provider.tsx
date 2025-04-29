"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { ProjectsStateAction, ProjectsStateActionType } from "./actions";
import { api, FieldsRequired } from "./api";
import { ProjectsStateContext } from "./state-context";
import { ProjectsActionsContext } from "./actions-context";
import { Project } from "@/models/project";

const handleApiError = (
  error: any,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred";
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

const handleSuccessToast = (
  toast: ReturnType<typeof useToast>["toast"],
  message: string
) => {
  toast({
    title: "Success",
    description: message,
  });
};

const fetchProjects = async (
  dispatch: React.Dispatch<ProjectsStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: ProjectsStateActionType.StartLoading });
    const projectResponse = await api.getProjects();

    dispatch({
      type: ProjectsStateActionType.FinishLoading,
      payload: {
        data: projectResponse.data.projects,
        defaultProject: projectResponse.data.defaultProject,
      },
    });
  } catch (err) {
    dispatch({
      type: ProjectsStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const ProjectsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    data: [] as Project[],
    defaultProject: null,
  });

  const { toast } = useToast();

  const fetchProjectsMemoized = useCallback(() => {
    fetchProjects(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchProjectsMemoized();
  }, [fetchProjectsMemoized]);

  const createProject = useCallback(
    async (data: FieldsRequired, onDone?: () => void) => {
      const tempId = "temp-id";

      const tempProject: Project = {
        _id: tempId,
        deleted: false,
        order: 0,
        ...data,
      };
      dispatch({
        type: ProjectsStateActionType.CreateProject,
        payload: { project: tempProject },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createProject(data);

        dispatch({
          type: ProjectsStateActionType.UpdateProject,
          payload: {
            id: tempId,
            project: response.data,
          },
        });

        handleSuccessToast(toast, "Project has been created");
      } catch (e: any) {
        // todo: fix
        dispatch({
          type: ProjectsStateActionType.DeleteProject,
          payload: {
            id: tempId,
          },
        });
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const updateProject = useCallback(
    async (projectId: string, props: Partial<Project>, onDone?: () => void) => {
      try {
        dispatch({
          type: ProjectsStateActionType.UpdateProject,
          payload: {
            id: projectId,
            project: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateProject(projectId, props);

        handleSuccessToast(toast, "Project has been updated");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const deleteProject = useCallback(
    async (projectId: string, onDone?: () => void) => {
      try {
        dispatch({
          type: ProjectsStateActionType.DeleteProject,
          payload: {
            id: projectId,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteProject(projectId);

        handleSuccessToast(toast, "Project has been deleted");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const updateOrder = async (
    movedProjectId: string,
    overProjectId: string,
    onDone?: () => void
  ) => {
    try {
      dispatch({
        type: ProjectsStateActionType.UpdateOrder,
        payload: {
          movedProjectId,
          overProjectId,
        },
      });

      if (onDone) {
        onDone();
      }

      await api.updateOrder({
        sortOrder: state.data.map((p, index) => ({
          projectId: p._id,
          order: index,
        })),
      });
      handleSuccessToast(toast, "Project order been updated");
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || "An unexpected error occurred";
      handleApiError(errorMessage, toast);
    }
  };

  const getProjectById = (id: string) => {
    return state.data.find((project) => project._id === id) || null;
  };

  return (
    <ProjectsStateContext.Provider value={{ ...state, getProjectById }}>
      <ProjectsActionsContext.Provider
        value={{
          create: createProject,
          update: updateProject,
          delete: deleteProject,
          updateOrder,
        }}
      >
        {children}
      </ProjectsActionsContext.Provider>
    </ProjectsStateContext.Provider>
  );
};
