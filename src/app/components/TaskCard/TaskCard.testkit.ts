import { fireEvent, within, screen } from "@/config/utils/test-utils";
import { cardTestId, taskFormTestId, titleTestId } from "./TaskCard";
import { getTaskFormTestkit } from "../TaskForm/TaskForm.testkit";

export const getTaskCardTestkit = (component: HTMLElement) => {
  const openContextMenu = () => {
    const title = within(component).getByTestId(titleTestId);
    fireEvent.contextMenu(title);
  };
  return {
    getComponent: () => component,
    getTitle: () => within(component).getByTestId(titleTestId).textContent,
    clickComplete: () => {
      openContextMenu();
      const completeButton = screen.getByText("Complete");
      fireEvent.click(completeButton);
    },
    clickDeactivate: () => {
      openContextMenu();
      const completeButton = screen.getByText("Deactivate");
      fireEvent.click(completeButton);
    },
    clickUndo: () => {
      openContextMenu();
      const completeButton = screen.getByText("Undo");
      fireEvent.click(completeButton);
    },
    clickEdit: () => {
      openContextMenu();
      fireEvent.click(screen.getByText("Edit"));
    },
    cardIsFaded: () =>
      within(component)
        .getByTestId(cardTestId)
        .className.includes("opacity-40"),
    cardTextIsStriked: () =>
      within(component)
        .getByTestId(cardTestId)
        .className.includes("line-through"),

    taskFormIsOpen: () => screen.queryAllByTestId(taskFormTestId).length === 1,
    getTaskFormTitleValue: () =>
      getTaskFormTestkit(
        screen.getByTestId(taskFormTestId)
      ).getTitleInputValue(),
    enterTitle: (value: string) =>
      getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setTitle(value),
    getTaskFormDescriptionValue: () =>
      getTaskFormTestkit(
        screen.getByTestId(taskFormTestId)
      ).getDescriptionInputValue(),
    enterDescription: (value: string) =>
      getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setDescription(
        value
      ),
    getTaskFormEtaValue: (name: string) =>
      getTaskFormTestkit(
        screen.getByTestId(taskFormTestId)
      ).getEtaSelectedByName(name),
    setEta: (value: string) =>
      getTaskFormTestkit(screen.getByTestId(taskFormTestId)).setEta(value),
    getTaskFormProjectValue: () =>
      getTaskFormTestkit(
        screen.getByTestId(taskFormTestId)
      ).getProjectInputValue(),
    submitForm: () =>
      getTaskFormTestkit(
        screen.getByTestId(taskFormTestId)
      ).clickCreateButton(),
  };
};
