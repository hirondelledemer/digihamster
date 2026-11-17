import { createContext, useContext } from "react";
import { HabitsState } from "./actions";

const DEFAULT_STATE: HabitsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
};

export const HabitsStateContext = createContext<HabitsState>(DEFAULT_STATE);

export const useHabitsState = () => useContext(HabitsStateContext);
