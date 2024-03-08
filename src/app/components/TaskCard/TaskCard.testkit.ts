import { fireEvent, within, screen } from "@/config/utils/test-utils";
import { cardTestId, titleTestId } from "./TaskCard";

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
    clickUndo: () => {
      openContextMenu();
      const completeButton = screen.getByText("Undo");
      fireEvent.click(completeButton);
    },
    cardIsFaded: () =>
      within(component)
        .getByTestId(cardTestId)
        .className.includes("opacity-40"),
    cardTextIsStriked: () =>
      within(component)
        .getByTestId(cardTestId)
        .className.includes("line-through"),
  };
};
