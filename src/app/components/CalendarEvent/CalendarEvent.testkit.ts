import { fireEvent, within } from "@/config/utils/test-utils";

export const getCalendarEventTestkit = (component: HTMLElement) => {
  const getEventTextIsStriked = () =>
    within(component).getByText(/event/i).className.includes("line-through");

  const getCompleteButton = () =>
    within(component).getByRole("button", {
      name: /complete/i,
    });
  const getDeleteButton = () =>
    within(component).getByRole("button", {
      name: /delete/i,
    });
  const completeButtonExists = () =>
    within(component).queryByRole("button", {
      name: /complete/i,
    }) !== null;
  const deleteButtonExists = () =>
    within(component).queryByRole("button", {
      name: /delete/i,
    }) !== null;

  const clickCompleteButton = () => fireEvent.click(getCompleteButton());
  const clickDeleteButton = () => fireEvent.click(getDeleteButton());

  return {
    getComponent: () => component,
    getEventTextIsStriked,

    completeButtonExists,
    clickCompleteButton,

    deleteButtonExists,
    clickDeleteButton,
  };
};
