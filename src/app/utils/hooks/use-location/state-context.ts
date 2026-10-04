import { locationsStore } from "./store";

export const LocationsStateContext = locationsStore.StateContext;

export const useLocationsState = locationsStore.useEntityState;
