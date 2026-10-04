import type { CrudActions } from "./create-crud-store";

/**
 * Shape of the actions context for a plain CRUD entity.
 *
 * Entities built with `createCrudStore` get this for free; the alias stays for
 * the ones still wiring their provider by hand.
 */
export type ActionsContextValue<FieldsRequired, Entity> = CrudActions<
  Entity,
  FieldsRequired
>;
