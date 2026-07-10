"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { TagsStateAction, TagsStateActionType } from "./actions";
import { api, CreateTagParams } from "./api";
import { TagsStateContext } from "./state-context";
import { TagsActionsContext } from "./actions-context";
import { Tag } from "@/models/tag";

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

const fetchTags = async (
  dispatch: React.Dispatch<TagsStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: TagsStateActionType.StartLoading });
    const response = await api.getTags();

    dispatch({
      type: TagsStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: TagsStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const TagsContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  const fetchDataMemoized = useCallback(() => {
    fetchTags(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createTag = useCallback(
    async (data: CreateTagParams, onDone?: () => void) => {
      const tempId = "temp-id";

      const tempTag = {
        _id: tempId,
        deleted: false,
        ...data,
      } as unknown as Tag;
      dispatch({
        type: TagsStateActionType.CreateTag,
        payload: { tag: tempTag },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createTag(data);

        dispatch({
          type: TagsStateActionType.UpdateTag,
          payload: {
            id: tempId,
            tag: response.data,
          },
        });

        handleSuccessToast(toast, "Tag has been created");
      } catch (e: any) {
        // todo: fix
        dispatch({
          type: TagsStateActionType.DeleteTag,
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

  const updateTag = useCallback(
    async (id: string, props: Partial<Tag>, onDone?: () => void) => {
      try {
        dispatch({
          type: TagsStateActionType.UpdateTag,
          payload: {
            id,
            tag: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateTag(id, props);

        handleSuccessToast(toast, "Tag has been updated");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const deleteTag = useCallback(
    async (id: string, onDone?: () => void) => {
      try {
        dispatch({
          type: TagsStateActionType.DeleteTag,
          payload: {
            id: id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteTag(id);

        handleSuccessToast(toast, "Tag has been deleted");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  return (
    <TagsStateContext.Provider value={state}>
      <TagsActionsContext.Provider
        value={{
          create: createTag,
          update: updateTag,
          delete: deleteTag,
        }}
      >
        {children}
      </TagsActionsContext.Provider>
    </TagsStateContext.Provider>
  );
};
