"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { LocationsStateAction, LocationsStateActionType } from "./actions";
import { api, CreateLocationParams } from "./api";
import { LocationsStateContext } from "./state-context";
import { LocationsActionsContext } from "./actions-context";
import { getApiErrorMessage } from "../../axios";
import { now } from "../../date/now";
import { ILocation } from "../../types/location";

const handleApiError = (
  error: unknown,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  toast({
    title: "Error",
    description: getApiErrorMessage(error),
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

const fetchLocations = async (
  dispatch: React.Dispatch<LocationsStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: LocationsStateActionType.StartLoading });
    const response = await api.getLocations();

    dispatch({
      type: LocationsStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: LocationsStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const LocationsContextProvider = ({
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
    fetchLocations(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createLocation = useCallback(
    async (data: CreateLocationParams, onDone?: () => void) => {
      // negative so it cannot collide with an id handed out by the backend
      const tempId = -now().valueOf();

      const tempLocation = {
        id: tempId,
        ...data,
      } satisfies ILocation;

      dispatch({
        type: LocationsStateActionType.CreateLocation,
        payload: { location: tempLocation },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createLocation(data);

        dispatch({
          type: LocationsStateActionType.UpdateLocation,
          payload: {
            id: tempId,
            location: response.data,
          },
        });

        handleSuccessToast(toast, "Location has been created");

        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: LocationsStateActionType.DeleteLocation,
          payload: {
            id: tempId,
          },
        });

        handleApiError(e, toast);
        return null;
      }
    },
    [toast]
  );

  const updateLocation = useCallback(
    async (id: number, props: Partial<ILocation>, onDone?: () => void) => {
      try {
        dispatch({
          type: LocationsStateActionType.UpdateLocation,
          payload: {
            id,
            location: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateLocation(id, props);

        handleSuccessToast(toast, "Location has been updated");
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  const deleteLocation = useCallback(
    async (id: number, onDone?: () => void) => {
      try {
        dispatch({
          type: LocationsStateActionType.DeleteLocation,
          payload: {
            id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteLocation(id);

        handleSuccessToast(toast, "Location has been deleted");
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast]
  );

  return (
    <LocationsStateContext.Provider value={state}>
      <LocationsActionsContext.Provider
        value={{
          create: createLocation,
          update: updateLocation,
          delete: deleteLocation,
        }}
      >
        {children}
      </LocationsActionsContext.Provider>
    </LocationsStateContext.Provider>
  );
};
