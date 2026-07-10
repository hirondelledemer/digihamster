export function updateObjById<T extends { id: string }>(
  arr: T[],
  id: string,
  updatedData: Partial<T>,
) {
  return arr.map((item) =>
    item.id === id ? { ...item, ...updatedData } : item,
  );
}
