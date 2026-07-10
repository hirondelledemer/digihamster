import { createContext, useContext } from "react";
import { HabitsNewState } from "./actions";

const DEFAULT_STATE: HabitsNewState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
};

export const HabitsNewStateContext =
  createContext<HabitsNewState>(DEFAULT_STATE);

export const useHabitsNewState = () => useContext(HabitsNewStateContext);
