import { fireEvent, screen } from "@/config/utils/test-utils";
import { taskFormTestId } from "./CommandTool";
import { getTaskFormTestkit } from "../TaskForm/TaskForm.testkit";

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
  clickCreateActiveTask: () => {
    fireEvent.click(screen.getByText("Create Active Task"));
  },
  clickCreateTask: () => {
    fireEvent.click(screen.getByText("Create Task"));
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
