"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import {
  RelationshipsStateAction,
  RelationshipsStateActionType,
} from "./actions";
import { api, CreateRelationshipParams } from "./api";
import { RelationshipsStateContext } from "./state-context";
import { RelationshipsActionsContext } from "./actions-context";
import { getApiErrorMessage } from "../../axios";
import { now } from "../../date/now";
import { IRelationship } from "../../types/relationship";

// the backend only knows one kind of link so far, and it is what it fills in
// for a created relationship — the optimistic copy has to match it
const DEFAULT_RELATIONSHIP_TYPE = "related";

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

// relationships are always created or removed alongside another entity, whose
// own action already reported the success — only failures are worth a toast

const fetchRelationships = async (
  dispatch: React.Dispatch<RelationshipsStateAction>,
  toast: ReturnType<typeof useToast>["toast"],
) => {
  try {
    dispatch({ type: RelationshipsStateActionType.StartLoading });
    const response = await api.getRelationships();

    dispatch({
      type: RelationshipsStateActionType.FinishLoading,
      payload: { data: response.data || [] },
    });
  } catch (err) {
    dispatch({
      type: RelationshipsStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const RelationshipsContextProvider = ({
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
    fetchRelationships(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  const createRelationship = useCallback(
    async (data: CreateRelationshipParams, onDone?: () => void) => {
      const tempId = -now().valueOf();

      const tempRelationship = {
        id: tempId,
        relationship_type: DEFAULT_RELATIONSHIP_TYPE,
        ...data,
      } as const satisfies IRelationship;

      dispatch({
        type: RelationshipsStateActionType.CreateRelationship,
        payload: { relationship: tempRelationship },
      });

      if (onDone) {
        onDone();
      }

      try {
        const response = await api.createRelationship(data);

        dispatch({
          type: RelationshipsStateActionType.UpdateRelationship,
          payload: {
            id: tempId,
            relationship: response.data,
          },
        });

        return response.data;
      } catch (e: unknown) {
        dispatch({
          type: RelationshipsStateActionType.DeleteRelationship,
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

  const updateRelationship = useCallback(
    async (id: number, props: Partial<IRelationship>, onDone?: () => void) => {
      try {
        dispatch({
          type: RelationshipsStateActionType.UpdateRelationship,
          payload: {
            id,
            relationship: props,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.updateRelationship(id, props);
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  const deleteRelationship = useCallback(
    async (id: number, onDone?: () => void) => {
      try {
        dispatch({
          type: RelationshipsStateActionType.DeleteRelationship,
          payload: {
            id,
          },
        });
        if (onDone) {
          onDone();
        }

        await api.deleteRelationship(id);
      } catch (e: unknown) {
        handleApiError(e, toast);
      }
    },
    [toast],
  );

  return (
    <RelationshipsStateContext.Provider value={state}>
      <RelationshipsActionsContext.Provider
        value={{
          create: createRelationship,
          update: updateRelationship,
          delete: deleteRelationship,
        }}
      >
        {children}
      </RelationshipsActionsContext.Provider>
    </RelationshipsStateContext.Provider>
  );
};
