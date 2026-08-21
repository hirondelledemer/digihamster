"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { ProjectsStateAction, ProjectsStateActionType } from "./actions";
import { api, FieldsRequired } from "./api";
import { ProjectsStateContext } from "./state-context";
import { ProjectsActionsContext } from "./actions-context";
import { IProject } from "../../types/project";
import { getApiErrorMessage } from "../../axios";

const handleApiError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
    variant: "destructive",
  });
};

const handleSuccessToast = (
  toast: ReturnType<typeof useToast>["toast"],
  message: string,
) => {
  toast({
    title: "Success",
    description: message,
  });
};

const fetchProjects = async (
  dispatch: React.Dispatch<ProjectsStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: ProjectsStateActionType.StartLoading });
    const projectResponse = await api.getProjects();

    dispatch({
      type: ProjectsStateActionType.FinishLoading,
      payload: {
        data: projectResponse.data,
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
    data: [] as IProject[],
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
      const tempId = -1;

      const tempProject: IProject = {
        id: tempId,
        sort_order: 0,
        created_at: "",
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
        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: ProjectsStateActionType.DeleteProject,
          payload: {
            id: tempId,
          },
        });

        handleApiError(e, toast);
        return null;
      }
    },
    [toast],
  );

  const updateProject = useCallback(
    async (
      projectId: number,
      props: Partial<IProject>,
      onDone?: () => void,
    ) => {
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
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deleteProject = useCallback(
    async (projectId: number, onDone?: () => void) => {
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
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const updateOrder = async (sortedProjectIds: number[]) => {
    sortedProjectIds.forEach((id, index) => {
      dispatch({
        type: ProjectsStateActionType.UpdateProject,
        payload: { id, project: { sort_order: index + 1 } },
      });
    });
    try {
      await api.reorder(sortedProjectIds);
      toast({
        title: "Success",
        description: "Projects have been reordered successfully",
      });
    } catch (e: unknown) {
      handleApiError(e, toast);
    }
  };

  const getProjectById = (id: number) => {
    return state.data.find((project) => project.id === id) || null;
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
