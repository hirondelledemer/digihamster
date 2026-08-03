export interface ActionsContextValue<FieldsRequired, Entity> {
  create(note: FieldsRequired, onDone?: () => void): Promise<Entity | null>;
  update(
    id: number,
    entity: Partial<Entity>,
    onDone?: () => void,
  ): Entity | null;
  delete(id: number, onDone?: () => void): void;
}
