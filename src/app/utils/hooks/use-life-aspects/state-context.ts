import { createContext, useContext } from "react";
import { LifeAspectsState } from "./actions";

type LifeAspectsStateContextValue = LifeAspectsState;

const DEFAULT_LIFE_ASPECTS_STATE: LifeAspectsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const LifeAspectsStateContext =
  createContext<LifeAspectsStateContextValue>(DEFAULT_LIFE_ASPECTS_STATE);

export const useLifeAspectsState = () => useContext(LifeAspectsStateContext);
