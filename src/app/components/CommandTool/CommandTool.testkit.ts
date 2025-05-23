import { fireEvent, screen } from "@/config/utils/test-utils";
import { getTaskFormTestkit } from "../TaskForm/TaskForm.testkit";
import { taskFormTestId } from "../TaskForm/TaskForm";

export const getCommandToolTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  commandToolOpen: () => screen.queryAllByRole("dialog").length === 1,
  pressCmdK: () => {
    fireEvent.keyDown(component, {
      key: "k",
      code: "KeyK",
      metaKey: true,
    });
  },
  getCreateActiveTaskExists: () =>
    screen.queryAllByText("Create Active Task").length !== 0,
  getCreateQuickTaskExists: () =>
    screen.queryAllByText("Add Quick Task").length !== 0,
  clickCreateActiveTask: () => {
    fireEvent.click(screen.getByText("Create Active Task"));
  },
  clickAddQuickTask: () => {
    fireEvent.click(screen.getByText("Add Quick Task"));
  },
  getCreateTaskExists: () => screen.queryAllByText("Create Task").length !== 0,
  clickCreateTask: () => {
    fireEvent.click(screen.getByText("Create Task"));
  },
  clickGoToTasks: () => {
    fireEvent.click(screen.getByText("/tasks"));
  },
  clickGoToHome: () => {
    fireEvent.click(screen.getByText("/home"));
  },
  enterSearch: (value: string) => {
    fireEvent.change(screen.getByRole("combobox"), { target: { value } });
  },
  taskFormIsOpen: () => screen.queryAllByTestId(taskFormTestId).length === 1,

  // task form
  enterTitle: (value: string) =>
    getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setTitle(value),
  getTitle: () =>
    getTaskFormTestkit(screen.getByTestId(taskFormTestId)).getTitleInputValue(),
  enterDescription: (value: string) =>
    getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setDescription(
      value
    ),
  enterEta: (value: string) =>
    getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setEta(value),
  submitTaskForm: () =>
    getTaskFormTestkit(screen.getByTestId(taskFormTestId)).clickCreateButton(),
});
