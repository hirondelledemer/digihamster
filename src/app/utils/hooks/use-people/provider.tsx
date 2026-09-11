"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { PeopleStateAction, PeopleStateActionType } from "./actions";
import { api, CreatePersonParams } from "./api";
import { PeopleStateContext } from "./state-context";
import { PeopleActionsContext } from "./actions-context";
import { getApiErrorMessage } from "../../axios";
import { now } from "../../date/now";
import { IPerson } from "../../types/person";

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

const fetchPeople = async (
  dispatch: React.Dispatch<PeopleStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: PeopleStateActionType.StartLoading });
    const response = await api.getPeople();

    dispatch({
      type: PeopleStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: PeopleStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const PeopleContextProvider = ({
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
    fetchPeople(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createPerson = useCallback(
    async (data: CreatePersonParams, onDone?: () => void) => {
      // negative so it cannot collide with an id handed out by the backend
      const tempId = -now().valueOf();

      const tempPerson = {
        id: tempId,
        deleted: false,
        ...data,
      } satisfies IPerson;

      dispatch({
        type: PeopleStateActionType.CreatePerson,
        payload: { person: tempPerson },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createPerson(data);

        dispatch({
          type: PeopleStateActionType.UpdatePerson,
          payload: {
            id: tempId,
            person: response.data,
          },
        });

        handleSuccessToast(toast, "Person has been created");

        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: PeopleStateActionType.DeletePerson,
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

  const updatePerson = useCallback(
    async (id: number, props: Partial<IPerson>, onDone?: () => void) => {
      try {
        dispatch({
          type: PeopleStateActionType.UpdatePerson,
          payload: {
            id,
            person: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updatePerson(id, props);

        handleSuccessToast(toast, "Person has been updated");
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deletePerson = useCallback(
    async (id: number, onDone?: () => void) => {
      try {
        dispatch({
          type: PeopleStateActionType.DeletePerson,
          payload: {
            id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deletePerson(id);

        handleSuccessToast(toast, "Person has been deleted");
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  return (
    <PeopleStateContext.Provider value={state}>
      <PeopleActionsContext.Provider
        value={{
          create: createPerson,
          update: updatePerson,
          delete: deletePerson,
        }}
      >
        {children}
      </PeopleActionsContext.Provider>
    </PeopleStateContext.Provider>
  );
};
