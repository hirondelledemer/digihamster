import { fireEvent, within, screen } from "@/config/utils/test-utils";
import { cardTestId, titleTestId } from "./TaskCard";
import { getTaskFormTestkit } from "../TaskForm/TaskForm.testkit";
import { taskFormTestId } from "../TaskForm/TaskForm";

export const getTaskCardTestkit = (component: HTMLElement) => {
  const openContextMenu = () => {
    const title = within(component).getByTestId(titleTestId);
    fireEvent.contextMenu(title);
  };
  return {
    getComponent: () => component,
    getTitle: () => within(component).getByTestId(titleTestId).textContent,
    staleIndicatorIsVisible: () =>
      within(component).queryByTestId("dinosaur-icon") !== null,
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
    clickRemoveEvent: () => {
      openContextMenu();
      const removeButton = screen.getByText("Remove from event");
      fireEvent.click(removeButton);
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

    // task form

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
      getTaskFormTestkit(screen.getByTestId(taskFormTestId)).clickEditButton(),
  };
};
