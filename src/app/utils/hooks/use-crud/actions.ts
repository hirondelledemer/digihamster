export interface CrudState<Entity> {
  data: Entity[];
  isLoading: boolean;
  errorMessage?: unknown;
}

/**
 * Action shape every entity store understands. Entities that need more than
 * CRUD declare their own union and hand it to `createCrudStore` as
 * `ExtraAction` — it is dispatched through the same reducer.
 */
export interface UnknownAction {
  type: string;
  payload?: unknown;
}

export enum CrudActionType {
  StartLoading = "START_LOADING",
  FinishLoading = "FINISH_LOADING",
  Error = "ERROR",
  Create = "CREATE",
  Update = "UPDATE",
  Delete = "DELETE",
}

export interface StartLoadingAction {
  type: CrudActionType.StartLoading;
}

export interface FinishLoadingAction<Entity> {
  type: CrudActionType.FinishLoading;
  payload: {
    data: Entity[];
  };
}

export interface ErrorAction {
  type: CrudActionType.Error;
  payload: {
    errorMessage: unknown;
  };
}

export interface CreateAction<Entity> {
  type: CrudActionType.Create;
  payload: {
    entity: Entity;
  };
}

export interface UpdateAction<Entity> {
  type: CrudActionType.Update;
  payload: {
    id: number;
    entity: Partial<Entity>;
  };
}

export interface DeleteAction {
  type: CrudActionType.Delete;
  payload: {
    id: number;
  };
}

export type CrudAction<Entity> =
  | StartLoadingAction
  | FinishLoadingAction<Entity>
  | ErrorAction
  | CreateAction<Entity>
  | UpdateAction<Entity>
  | DeleteAction;

const CRUD_ACTION_TYPES: ReadonlySet<string> = new Set(
  Object.values(CrudActionType)
);

export const isCrudAction = <Entity>(
  action: UnknownAction
): action is CrudAction<Entity> => CRUD_ACTION_TYPES.has(action.type);
