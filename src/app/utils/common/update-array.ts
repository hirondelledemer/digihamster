import { ObjectId } from "mongoose";

export function updateObjById<T extends { _id: ObjectId }>(
  arr: T[],
  id: ObjectId,
  updatedData: Partial<T>
) {
  return arr.map((item) =>
    item._id === id ? { ...item, ...updatedData } : item
  );
}
