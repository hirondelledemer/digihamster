import { TaskV2 } from "@/models/taskV2";

export const addEstimates = (acc: number, val: TaskV2): number =>
  acc + (val.estimate || 0);
