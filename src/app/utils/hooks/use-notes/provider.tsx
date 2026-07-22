"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { NotesStateAction, NotesStateActionType } from "./actions";
import { api, CreateNoteParams } from "./api";
import { NotesStateContext } from "./state-context";
import { NotesActionsContext } from "./actions-context";
import { getApiErrorMessage } from "../../axios";
import { now } from "../../date/now";
import { INote } from "../../types/note";
import { toBackendDateTime } from "#utils/date";

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

const fetchNotes = async (
  dispatch: React.Dispatch<NotesStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: NotesStateActionType.StartLoading });
    const response = await api.getNotes();

    dispatch({
      type: NotesStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: NotesStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const NotesContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
  });

  const { toast } = useToast();

  const fetchDataMemoized = useCallback(() => {
    fetchNotes(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createNote = useCallback(
    async (data: CreateNoteParams, onDone?: () => void) => {
      const nowDate = now();
      const tempId = -nowDate.valueOf();

      const tempNote: INote = {
        id: tempId,
        deleted: false,
        created_at: toBackendDateTime(nowDate),
        user_id: "",
        ...data,
      };
      dispatch({
        type: NotesStateActionType.CreateNote,
        payload: { note: tempNote },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createNote(data);

        dispatch({
          type: NotesStateActionType.UpdateNote,
          payload: {
            id: tempId,
            note: response.data,
          },
        });

        handleSuccessToast(toast, "Note has been created");
      } catch (e: unknown) {
        dispatch({
          type: NotesStateActionType.DeleteNote,
          payload: {
            id: tempId,
          },
        });

        handleApiError(getApiErrorMessage(e), toast);
      }
    },
    [toast],
  );

  const updateNote = useCallback(
    async (id: number, props: Partial<INote>, onDone?: () => void) => {
      try {
        dispatch({
          type: NotesStateActionType.UpdateNote,
          payload: {
            id,
            note: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateNote(id, props);

        handleSuccessToast(toast, "Note has been updated");
      } catch (e: unknown) {
        handleApiError(getApiErrorMessage(e), toast);
      }
    },
    [toast],
  );

  const deleteNote = useCallback(
    async (id: number, onDone?: () => void) => {
      try {
        dispatch({
          type: NotesStateActionType.DeleteNote,
          payload: {
            id: id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteNote(id);

        handleSuccessToast(toast, "Note has been deleted");
      } catch (e: unknown) {
        handleApiError(getApiErrorMessage(e), toast);
      }
    },
    [toast],
  );

  return (
    <NotesStateContext.Provider value={state}>
      <NotesActionsContext.Provider
        value={{
          create: createNote,
          update: updateNote,
          delete: deleteNote,
        }}
      >
        {children}
      </NotesActionsContext.Provider>
    </NotesStateContext.Provider>
  );
};
