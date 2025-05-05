"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { NotesStateAction, NotesStateActionType } from "./actions";
import { api, CreateNoteParams } from "./api";
import { NotesStateContext } from "./state-context";
import { NotesActionsContext } from "./actions-context";
import { Note } from "@/models/note";

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

const fetchNotes = async (
  dispatch: React.Dispatch<NotesStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: NotesStateActionType.StartLoading });
    const response = await api.getNotes();

    dispatch({
      type: NotesStateActionType.FinishLoading,
      payload: { data: response.data },
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
      const tempId = "temp-id";

      const tempNote: Note = {
        _id: tempId,
        deleted: false,
        createdAt: "",
        updatedAt: "",
        isActive: false,
        userId: "", // todo: why this is not required in other places?
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
      } catch (e: any) {
        // todo: fix
        dispatch({
          type: NotesStateActionType.DeleteNote,
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

  const updateNote = useCallback(
    async (id: string, props: Partial<Note>, onDone?: () => void) => {
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
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
  );

  const deleteNote = useCallback(
    async (id: string, onDone?: () => void) => {
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
      } catch (e: any) {
        const errorMessage =
          e.response?.data?.message || "An unexpected error occurred";
        handleApiError(errorMessage, toast);
      }
    },
    [toast]
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
