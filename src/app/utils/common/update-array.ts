export function updateObjById<T extends { id: number }>(
  arr: T[],
  id: number,
  updatedData: Partial<T>,
) {
  return arr.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item,
  );
}
