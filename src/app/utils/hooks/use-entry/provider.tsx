"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { EntriesStateAction, EntriesStateActionType } from "./actions";
import { api, CreateEntryParams } from "./api";
import { EntriesStateContext } from "./state-context";
import { EntriesActionsContext } from "./actions-context";
import { IJournalEntry } from "../../types/journal-entry";
import { toBackendDateTime } from "#utils/date";
import { now } from "../../date/now";
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
      const nowDate = now();
      const tempId = -nowDate.valueOf();

      const tempEntry = {
        id: tempId,
        created_at: toBackendDateTime(nowDate),
        ...data,
      } as const satisfies IJournalEntry;

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
        // callers need the saved entry to hang related records off its real id
        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: EntriesStateActionType.DeleteEntry,
          payload: {
            id: tempId,
          },
        });

        handleApiError(getApiErrorMessage(e), toast);
        return null;
      }
    },
    [toast],
  );

  const updateEntry = useCallback(
    async (id: number, props: Partial<IJournalEntry>, onDone?: () => void) => {
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
      } catch (e: unknown) {
        handleApiError(getApiErrorMessage(e), toast);
      }
    },
    [toast],
  );

  const deleteEntry = useCallback(
    async (id: number, onDone?: () => void) => {
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
      } catch (e: unknown) {
        handleApiError(getApiErrorMessage(e), toast);
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
