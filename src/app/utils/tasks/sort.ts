import { ITask } from "../types/task";

export const sortInTheEvent = (tasks: ITask[]) =>
  tasks.sort(
    (taskA, taskB) =>
      (taskA.event_sort_order || 0) - (taskB.event_sort_order || 0),
  );
