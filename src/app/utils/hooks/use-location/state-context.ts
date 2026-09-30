import { createContext, useContext } from "react";
import { LocationsState } from "./actions";

type LocationsContextValue = LocationsState;

const DEFAULT_LOCATIONS_STATE: LocationsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const LocationsStateContext = createContext<LocationsContextValue>(
  DEFAULT_LOCATIONS_STATE
);

export const useLocationsState = () => useContext(LocationsStateContext);
