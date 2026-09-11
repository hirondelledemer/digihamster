import { IPerson } from "../../types/person";

export interface PeopleState {
  data: IPerson[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum PeopleStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreatePerson = "CREATE_PERSON",
  UpdatePerson = "UPDATE_PERSON",
  DeletePerson = "DELETE_PERSON",
}

export interface PeopleLoadAction {
  type: PeopleStateActionType.StartLoading;
}
export interface PeopleFinishLoadingAction {
  type: PeopleStateActionType.FinishLoading;
  payload: {
    data: IPerson[];
  };
}

export interface PeopleErrorAction {
  type: PeopleStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreatePersonAction {
  type: PeopleStateActionType.CreatePerson;
  payload: {
    person: IPerson;
  };
}

export interface UpdatePersonAction {
  type: PeopleStateActionType.UpdatePerson;
  payload: {
    id: number;
    person: Partial<IPerson>;
  };
}
export interface DeletePersonAction {
  type: PeopleStateActionType.DeletePerson;
  payload: {
    id: number;
  };
}

export type PeopleStateAction =
  | PeopleLoadAction
  | PeopleFinishLoadingAction
  | PeopleErrorAction
  | CreatePersonAction
  | UpdatePersonAction
  | DeletePersonAction;
