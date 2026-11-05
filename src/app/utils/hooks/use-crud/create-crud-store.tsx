"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { useToast } from "@/app/components/ui/use-toast";

import { now } from "../../date/now";
import {
  CrudAction,
  CrudActionType,
  CrudState,
  UnknownAction,
  isCrudAction,
} from "./actions";
import { CrudApi } from "./api";
import { crudReducer } from "./reducer";
import { Toast, handleApiError, handleSuccessToast } from "./toast";

export interface CrudActions<Entity, CreateParams> {
  create(data: CreateParams, onDone?: () => void): Promise<Entity | null>;
  update(
    id: number,
    props: Partial<Entity>,
    onDone?: () => void
  ): Promise<Entity | null>;
  delete(id: number, onDone?: () => void): void;
}

export interface ExtraActionsArgs<Entity, Action> {
  state: CrudState<Entity>;
  dispatch: Dispatch<Action>;
  toast: Toast;
}

export interface CrudStoreConfig<
  Entity extends { id: number },
  CreateParams,
  Extra,
  ExtraAction extends UnknownAction
> {
  /** Used in toasts: "Location has been created". */
  entityName: string;
  api: CrudApi<Entity, CreateParams>;
  /**
   * Builds the row shown optimistically while `create` is in flight.
   *
   * Required on purpose. Spreading the create params over a temp id looks
   * like it would do, but an entity is nearly always more than what you send
   * to create it - the server fills in timestamps, a starting status, sort
   * orders. Leaving those undefined for the length of the POST is invisible
   * to the type checker and shows up as a blank field or a 1970 date in the
   * UI, so each store is made to say what its half-built row looks like.
   */
  toOptimistic: (data: CreateParams, tempId: number) => Entity;
  /** Handles the actions `crudReducer` does not own. */
  extraReducer?: (
    state: CrudState<Entity>,
    action: ExtraAction
  ) => CrudState<Entity>;
  /**
   * Actions beyond CRUD. A hook, so it can use `dispatch`/`toast` — memoize
   * what it returns, it goes straight into the context value.
   */
  useExtraActions?: (
    args: ExtraActionsArgs<Entity, CrudAction<Entity> | ExtraAction>
  ) => Extra;
  /** What the extra actions do with no provider above them. */
  defaultExtraActions?: Extra;
}

const EMPTY_EXTRA_ACTIONS = {};
const useNoExtraActions = () => EMPTY_EXTRA_ACTIONS;

/**
 * Builds the state context, the actions context and the provider for an
 * entity whose API is the usual list/create/update/delete.
 *
 * Creating is optimistic: the row is added under a temporary negative id,
 * then replaced with the server's row, or dropped if the request fails.
 */
export function createCrudStore<
  Entity extends { id: number },
  CreateParams,
  Extra = object,
  ExtraAction extends UnknownAction = never
>(config: CrudStoreConfig<Entity, CreateParams, Extra, ExtraAction>) {
  type Action = CrudAction<Entity> | ExtraAction;
  type ActionsValue = CrudActions<Entity, CreateParams> & Extra;

  const DEFAULT_STATE: CrudState<Entity> = {
    data: [],
    isLoading: false,
    errorMessage: undefined,
  };

  const DEFAULT_ACTIONS: ActionsValue = {
    // nothing was created or saved without a provider, so there is nothing to
    // hand back
    create: async () => null,
    update: async () => null,
    delete: () => {},
    ...(config.defaultExtraActions ?? ({} as Extra)),
  };

  const StateContext = createContext<CrudState<Entity>>(DEFAULT_STATE);
  const ActionsContext = createContext<ActionsValue>(DEFAULT_ACTIONS);

  const reducer = (
    state: CrudState<Entity>,
    action: Action
  ): CrudState<Entity> =>
    isCrudAction<Entity>(action)
      ? crudReducer(state, action)
      : config.extraReducer?.(state, action) ?? state;

  const useExtraActions = (config.useExtraActions ?? useNoExtraActions) as (
    args: ExtraActionsArgs<Entity, Action>
  ) => Extra;

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
    const { toast } = useToast();

    const fetchData = useCallback(async () => {
      try {
        dispatch({ type: CrudActionType.StartLoading });
        const response = await config.api.getAll();

        dispatch({
          type: CrudActionType.FinishLoading,
          payload: { data: response.data || [] },
        });
      } catch (err) {
        dispatch({
          type: CrudActionType.Error,
          payload: { errorMessage: err },
        });
        handleApiError(err, toast);
      }
    }, [toast]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const create = useCallback(
      async (data: CreateParams, onDone?: () => void) => {
        // negative so it cannot collide with an id handed out by the backend
        const tempId = -now().valueOf();

        const optimisticEntity = config.toOptimistic(data, tempId);

        dispatch({
          type: CrudActionType.Create,
          payload: { entity: optimisticEntity },
        });

        if (onDone) {
          onDone();
        }

        try {
          const response = await config.api.create(data);

          dispatch({
            type: CrudActionType.Update,
            payload: { id: tempId, entity: response.data },
          });

          handleSuccessToast(toast, `${config.entityName} has been created`);

          return response.data;
        } catch (e: unknown) {
          dispatch({
            type: CrudActionType.Delete,
            payload: { id: tempId },
          });

          handleApiError(e, toast);
          return null;
        }
      },
      [toast]
    );

    const update = useCallback(
      async (id: number, props: Partial<Entity>, onDone?: () => void) => {
        try {
          dispatch({
            type: CrudActionType.Update,
            payload: { id, entity: props },
          });
          if (onDone) {
            onDone();
          }

          const response = await config.api.update(id, props);

          // the optimistic patch only knows what the caller passed. Anything
          // the server derives from it - a timestamp it stamps, a status it
          // moves on your behalf - is only in its reply, and without this it
          // would not reach state until the next full fetch
          if (response.data && typeof response.data === "object") {
            dispatch({
              type: CrudActionType.Update,
              payload: { id, entity: response.data },
            });
          }

          handleSuccessToast(toast, `${config.entityName} has been updated`);

          return response.data ?? null;
        } catch (e: unknown) {
          handleApiError(e, toast);
          return null;
        }
      },
      [toast]
    );

    const remove = useCallback(
      async (id: number, onDone?: () => void) => {
        try {
          dispatch({
            type: CrudActionType.Delete,
            payload: { id },
          });
          if (onDone) {
            onDone();
          }

          await config.api.delete(id);

          handleSuccessToast(toast, `${config.entityName} has been deleted`);
        } catch (e: unknown) {
          handleApiError(e, toast);
        }
      },
      [toast]
    );

    const extraActions = useExtraActions({ state, dispatch, toast });

    const actions: ActionsValue = useMemo(
      () => ({
        create,
        update,
        delete: remove,
        ...extraActions,
      }),
      [create, update, remove, extraActions]
    );

    return (
      <StateContext.Provider value={state}>
        <ActionsContext.Provider value={actions}>
          {children}
        </ActionsContext.Provider>
      </StateContext.Provider>
    );
  };

  return {
    Provider,
    StateContext,
    ActionsContext,
    useEntityState: () => useContext(StateContext),
    useEntityActions: () => useContext(ActionsContext),
  };
}
