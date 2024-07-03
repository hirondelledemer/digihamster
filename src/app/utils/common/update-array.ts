export function updateObjById<T extends { id: string }>(
  arr: T[],
  id: string,
  updatedData: Partial<T>
) {
  return arr.map((item) =>
    item.id.toString() === id ? { ...item, ...updatedData } : item
  );
}
