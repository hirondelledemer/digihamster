export function updateObjById<T extends { _id: string }>(
  arr: T[],
  id: string,
  updatedData: Partial<T>
) {
  return arr.map((item) =>
    item._id.toString() === id ? { ...item, ...updatedData } : item
  );
}
