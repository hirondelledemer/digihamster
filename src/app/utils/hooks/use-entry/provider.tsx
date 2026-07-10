"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { EntriesStateAction, EntriesStateActionType } from "./actions";
import { api, CreateEntryParams } from "./api";
import { EntriesStateContext } from "./state-context";
import { EntriesActionsContext } from "./actions-context";
import { JournalEntry } from "@/models/entry";

const handleApiError = (
  error: any,
  toast: ReturnType<typeof useToast>["toast"],
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
  message: string,
) => {
  toast({
    title: "Success",
    description: message,
  });
};

const fetchEntries = async (
  dispatch: React.Dispatch<EntriesStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: EntriesStateActionType.StartLoading });
    const response = await api.getEntries();

    dispatch({
      type: EntriesStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: EntriesStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const EntriesContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  const fetchDataMemoized = useCallback(() => {
    fetchEntries(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createEntry = useCallback(
    async (data: CreateEntryParams, onDone?: () => void) => {
      const tempId = "temp-id";

      const tempEntry = {
        _id: tempId,
        updatedAt: "",
        ...data,
      } as unknown as JournalEntry;
      dispatch({
        type: EntriesStateActionType.CreateEntry,
        payload: { entry: tempEntry },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createEntry(data);

        dispatch({
          type: EntriesStateActionType.UpdateEntry,
          payload: {
            id: tempId,
            entry: response.data,
          },
        });

        handleSuccessToast(toast, "Entry has been created");
      } catch (e: any) {
        // todo: fix
        dispatch({
          type: EntriesStateActionType.DeleteEntry,
          payload: {
            id: tempId,
          },
        });
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast],
  );

  const updateEntry = useCallback(
    async (id: string, props: Partial<JournalEntry>, onDone?: () => void) => {
      try {
        dispatch({
          type: EntriesStateActionType.UpdateEntry,
          payload: {
            id,
            entry: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateEntry(id, props);

        handleSuccessToast(toast, "Entry has been updated");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast],
  );

  const deleteEntry = useCallback(
    async (id: string, onDone?: () => void) => {
      try {
        dispatch({
          type: EntriesStateActionType.DeleteEntry,
          payload: {
            id: id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteEntry(id);

        handleSuccessToast(toast, "Entry has been deleted");
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast],
  );

  return (
    <EntriesStateContext.Provider value={state}>
      <EntriesActionsContext.Provider
        value={{
          create: createEntry,
          update: updateEntry,
          delete: deleteEntry,
        }}
      >
        {children}
      </EntriesActionsContext.Provider>
    </EntriesStateContext.Provider>
  );
};
