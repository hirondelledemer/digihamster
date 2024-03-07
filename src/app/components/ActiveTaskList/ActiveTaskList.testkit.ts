import { within } from "@/config/utils/test-utils";
import { taskTestId } from "./ActiveTaskList";
import { getTaskCardTestkit } from "../TaskCard/TaskCard.testkit";

export const getActiveTaskListTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTasksCount: () => within(component).queryAllByTestId(taskTestId).length,
  getTaskTitleAt: (index: number) =>
    getTaskCardTestkit(
      within(component).queryAllByTestId(taskTestId)[index]
    ).getTitle(),
});
