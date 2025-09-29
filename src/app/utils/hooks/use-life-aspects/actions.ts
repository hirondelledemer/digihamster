import { LifeAspect } from "@/models/life-aspect";

export interface LifeAspectsState {
  data: LifeAspect[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum LifeAspectStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
}

export interface LifeAspectLoadAction {
  type: LifeAspectStateActionType.StartLoading;
}
export interface LifeAspectFinishLoadingAction {
  type: LifeAspectStateActionType.FinishLoading;
  payload: {
    data: LifeAspect[];
  };
}

export interface LifeAspectErrorAction {
  type: LifeAspectStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}

export type LifeAspectStateAction =
  | LifeAspectLoadAction
  | LifeAspectFinishLoadingAction
  | LifeAspectErrorAction;
