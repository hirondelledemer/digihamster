import { createCrudStore } from "../use-crud/create-crud-store";
import { ILocation } from "../../types/location";
import { api, CreateLocationParams } from "./api";

export const locationsStore = createCrudStore<ILocation, CreateLocationParams>({
  entityName: "Location",
  api,
  // a location is its create params plus an id - the address fields are
  // optional and nothing is derived server side
  toOptimistic: (data, tempId) => ({ id: tempId, ...data }),
});

// ─── Example: a sorting method on top of regular CRUD ────────────────────────
//
// `createCrudStore` owns create/update/delete. Anything else an entity needs -
// reordering, archiving, a bulk move - goes in as an "extra". This is the shape
// `use-tasks` will take when it migrates, where the extras are
// `reorderTasksInTheProject` and `reorderTasksInTheEvent`.
//
// Written against locations so there is a worked example to copy, but note it
// is only a shape: `ILocation` has no `sort_order` field and the locations API
// has no `reorder` endpoint. Tasks has both (`project_sort_order`,
// `event_sort_order`, and `api.reorderTasksInTheProject`).
//
// An extra is four pieces that have to agree with each other.
//
// 1. THE ACTION. It goes through the same dispatch as the CRUD ones.
//    `createCrudStore` routes on the type string, so it has to be one
//    `CrudActionType` does not already own, or it lands in `crudReducer`
//    instead of yours.
//
// interface ReorderLocationsAction {
//   type: "REORDER_LOCATIONS";
//   payload: { sortedIds: number[] };
// }
//
// 2. THE REDUCER FOR IT. Everything that is not a CRUD action comes here, so
//    this only ever sees your own union. Return `state` untouched for anything
//    you do not handle - the store falls back to that anyway, but being
//    explicit keeps the switch honest when the union grows.
//
// const extraReducer = (
//   state: CrudState<ILocation>,
//   action: ReorderLocationsAction
// ): CrudState<ILocation> => {
//   switch (action.type) {
//     case "REORDER_LOCATIONS": {
//       const positionById = new Map(
//         action.payload.sortedIds.map((id, index) => [id, index + 1])
//       );
//
//       return {
//         ...state,
//         data: state.data.map((location) => {
//           const sortOrder = positionById.get(location.id);
//           return sortOrder ? { ...location, sort_order: sortOrder } : location;
//         }),
//       };
//     }
//     default:
//       return state;
//   }
// };
//
// 3. THE ACTION ITSELF. A hook, so it can reach `dispatch` and `toast`. It MUST
//    memoize what it returns - the value is spread straight into the actions
//    context, so a fresh object every render re-renders every consumer of
//    `useLocationsActions`.
//
//    Note this reorders in ONE dispatch. The tasks provider currently does
//    `sortedTaskIds.forEach(dispatch)`, which is N renders and N chances for
//    the list to tear mid-drag. Worth collapsing when it moves over.
//
// interface LocationsExtraActions {
//   sortLocations(sortedIds: number[]): Promise<void>;
// }
//
// const useExtraActions = ({
//   dispatch,
//   toast,
// }: ExtraActionsArgs<
//   ILocation,
//   CrudAction<ILocation> | ReorderLocationsAction
// >): LocationsExtraActions => {
//   const sortLocations = useCallback(
//     async (sortedIds: number[]) => {
//       dispatch({ type: "REORDER_LOCATIONS", payload: { sortedIds } });
//
//       try {
//         await api.reorder(sortedIds);
//       } catch (e: unknown) {
//         // decide what a failed save should do before you ship this. `create`
//         // can drop its optimistic row because it knows the row was new; a
//         // reorder has nothing to put back unless you captured the previous
//         // order first, or refetch here
//         handleApiError(e, toast);
//       }
//     },
//     [dispatch, toast]
//   );
//
//   return useMemo(() => ({ sortLocations }), [sortLocations]);
// };
//
// 4. WHAT IT DOES WITH NO PROVIDER ABOVE IT, matching the CRUD defaults.
//
// const defaultExtraActions: LocationsExtraActions = {
//   sortLocations: async () => {},
// };
//
// Then name both extra type parameters on the store. They default to `object`
// and `never`, so leaving them off is exactly what makes extras invisible to
// `useLocationsActions`:
//
// export const locationsStore = createCrudStore<
//   ILocation,
//   CreateLocationParams,
//   LocationsExtraActions,
//   ReorderLocationsAction
// >({
//   entityName: "Location",
//   api,
//   toOptimistic: (data, tempId) => ({ id: tempId, ...data }),
//   extraReducer,
//   useExtraActions,
//   defaultExtraActions,
// });
//
// Uncommenting needs `useCallback`/`useMemo` from react, `CrudState`/`CrudAction`
// from `../use-crud/actions`, `ExtraActionsArgs` from
// `../use-crud/create-crud-store`, and `handleApiError` from `../use-crud/toast`.
