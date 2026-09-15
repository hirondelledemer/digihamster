import { ILifeAspect } from "../../types/life-aspect";

export interface LifeAspectsState {
  data: ILifeAspect[];
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
    data: ILifeAspect[];
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
