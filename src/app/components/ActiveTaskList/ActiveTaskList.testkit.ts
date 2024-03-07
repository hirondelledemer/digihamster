import { within } from "@/config/utils/test-utils";
import { taskTestId } from "./ActiveTaskList";

export const getActiveTaskListTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTasksCount: () => within(component).queryAllByTestId(taskTestId).length,
});
