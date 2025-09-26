"use client";
import { ReactNode, useCallback, useEffect, useReducer } from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { reducer } from "./reducer";

import { LifeAspectStateAction, LifeAspectStateActionType } from "./actions";
import { api } from "./api";
import { LifeAspectsStateContext } from "./state-context";

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

const fetchLifeAspects = async (
  dispatch: React.Dispatch<LifeAspectStateAction>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    dispatch({ type: LifeAspectStateActionType.StartLoading });
    const response = await api.getLifeAspects();

    dispatch({
      type: LifeAspectStateActionType.FinishLoading,
      payload: { data: response.data },
    });
  } catch (err) {
    dispatch({
      type: LifeAspectStateActionType.Error,
      payload: { errorMessage: err },
    });
    handleApiError(err, toast);
  }
};

export const LifeAspectsContextProvider = ({
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
    fetchLifeAspects(dispatch, toast);
  }, [toast]);

  useEffect(() => {
    fetchDataMemoized();
  }, [fetchDataMemoized]);

  return (
    <LifeAspectsStateContext.Provider value={state}>
      {children}
    </LifeAspectsStateContext.Provider>
  );
};
