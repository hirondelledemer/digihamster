import { fireEvent, within, screen } from "@/config/utils/test-utils";

export const getCalendarEventTestkit = (component: HTMLElement) => {
  const getEventTextIsStriked = () =>
    within(component).getByText(/event/i).className.includes("line-through");

  const getCompleteButton = () => screen.getByText("Complete");
  const getDeleteButton = () => screen.getByText("Delete");
  const completeButtonExists = () =>
    screen.queryAllByText("Complete").length !== 0;

  const deleteButtonExists = () => screen.queryAllByText("Delete").length !== 0;

  const deadlineLabelExists = () =>
    within(component).queryAllByText("Deadline").length === 1;

  const clickCompleteButton = () => fireEvent.click(getCompleteButton());
  const clickDeleteButton = () => fireEvent.click(getDeleteButton());

  const openContextMenu = () => {
    const title = within(component).getByTestId("CalendarEvent-testId");
    fireEvent.contextMenu(title);
  };

  return {
    getComponent: () => component,
    getEventTextIsStriked,

    completeButtonExists: () => {
      openContextMenu();
      return completeButtonExists();
    },
    clickCompleteButton: () => {
      openContextMenu();
      clickCompleteButton();
    },

    deleteButtonExists,
    clickDeleteButton: () => {
      openContextMenu();
      clickDeleteButton();
    },

    deadlineLabelExists,
    ...within(component),
  };
};
