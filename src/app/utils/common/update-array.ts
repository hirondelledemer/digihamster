export function updateObjById<T extends { id: number | string }>(
  arr: T[],
  id: number | string,
  updatedData: Partial<T>,
) {
  return arr.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item,
  );
}
