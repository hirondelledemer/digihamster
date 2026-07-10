import { Tag } from "@/models/tag";

export interface TagsState {
  data: Tag[];
  isLoading: boolean;
  errorMessage?: unknown;
}

export enum TagsStateActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  CreateTag = "CREATE_TAG",
  UpdateTag = "UPDATE_TAG",
  DeleteTag = "DELETE_TAG",
}

export interface TagsLoadAction {
  type: TagsStateActionType.StartLoading;
}
export interface TagsFinishLoadingAction {
  type: TagsStateActionType.FinishLoading;
  payload: {
    data: Tag[];
  };
}

export interface TagsErrorAction {
  type: TagsStateActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}
export interface CreateTagAction {
  type: TagsStateActionType.CreateTag;
  payload: {
    tag: Tag;
  };
}

export interface UpdateTagAction {
  type: TagsStateActionType.UpdateTag;
  payload: {
    id: string;
    tag: Partial<Tag>;
  };
}
export interface DeleteTagAction {
  type: TagsStateActionType.DeleteTag;
  payload: {
    id: string;
  };
}

export type TagsStateAction =
  | TagsLoadAction
  | TagsFinishLoadingAction
  | TagsErrorAction
  | CreateTagAction
  | UpdateTagAction
  | DeleteTagAction;
