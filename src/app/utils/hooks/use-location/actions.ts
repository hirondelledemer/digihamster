import { ILocation } from "../../types/location";

export interface LocationsState {
  data: ILocation[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum LocationsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateLocation = "CREATE_LOCATION",
  UpdateLocation = "UPDATE_LOCATION",
  DeleteLocation = "DELETE_LOCATION",
}

export interface LocationsLoadAction {
  type: LocationsStateActionType.StartLoading;
}
export interface LocationsFinishLoadingAction {
  type: LocationsStateActionType.FinishLoading;
  payload: {
    data: ILocation[];
  };
}

export interface LocationsErrorAction {
  type: LocationsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateLocationAction {
  type: LocationsStateActionType.CreateLocation;
  payload: {
    location: ILocation;
  };
}

export interface UpdateLocationAction {
  type: LocationsStateActionType.UpdateLocation;
  payload: {
    id: number;
    location: Partial<ILocation>;
  };
}
export interface DeleteLocationAction {
  type: LocationsStateActionType.DeleteLocation;
  payload: {
    id: number;
  };
}

export type LocationsStateAction =
  | LocationsLoadAction
  | LocationsFinishLoadingAction
  | LocationsErrorAction
  | CreateLocationAction
  | UpdateLocationAction
  | DeleteLocationAction;
