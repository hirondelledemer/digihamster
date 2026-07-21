export interface ActionsContextValue<FieldsRequired, Entity> {
  create(note: FieldsRequired, onDone?: () => void): void;
  update(id: number, note: Partial<Entity>, onDone?: () => void): void;
  delete(id: number, onDone?: () => void): void;
}
