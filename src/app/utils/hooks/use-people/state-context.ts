import { createContext, useContext } from "react";
import { PeopleState } from "./actions";

type PeopleContextValue = PeopleState;

const DEFAULT_PEOPLE_STATE: PeopleState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const PeopleStateContext =
  createContext<PeopleContextValue>(DEFAULT_PEOPLE_STATE);

export const usePeopleState = () => useContext(PeopleStateContext);
