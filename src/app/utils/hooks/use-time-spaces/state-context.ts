import { timeSpacesStore } from "./store";

export const TimeSpacesStateContext = timeSpacesStore.StateContext;

export const useTimeSpacesState = timeSpacesStore.useEntityState;
