export interface ActionsContextValue<FieldsRequired, Entity> {
  create(note: FieldsRequired, onDone?: () => void): void;
  update(id: string, note: Partial<Entity>, onDone?: () => void): void;
  delete(id: string, onDone?: () => void): void;
}
