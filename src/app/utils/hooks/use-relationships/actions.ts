import { IRelationship } from "../../types/relationship";

export interface RelationshipsState {
  data: IRelationship[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum RelationshipsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateRelationship = "CREATE_RELATIONSHIP",
  UpdateRelationship = "UPDATE_RELATIONSHIP",
  DeleteRelationship = "DELETE_RELATIONSHIP",
}

export interface RelationshipsLoadAction {
  type: RelationshipsStateActionType.StartLoading;
}
export interface RelationshipsFinishLoadingAction {
  type: RelationshipsStateActionType.FinishLoading;
  payload: {
    data: IRelationship[];
  };
}

export interface RelationshipsErrorAction {
  type: RelationshipsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateRelationshipAction {
  type: RelationshipsStateActionType.CreateRelationship;
  payload: {
    relationship: IRelationship;
  };
}

export interface UpdateRelationshipAction {
  type: RelationshipsStateActionType.UpdateRelationship;
  payload: {
    id: number;
    relationship: Partial<IRelationship>;
  };
}
export interface DeleteRelationshipAction {
  type: RelationshipsStateActionType.DeleteRelationship;
  payload: {
    id: number;
  };
}

export type RelationshipsStateAction =
  | RelationshipsLoadAction
  | RelationshipsFinishLoadingAction
  | RelationshipsErrorAction
  | CreateRelationshipAction
  | UpdateRelationshipAction
  | DeleteRelationshipAction;
