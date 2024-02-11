import { fireEvent, within } from "@testing-library/react";

export const getTodayEventTestkit = (component: HTMLElement) => {
  const getCheckbox = () => within(component).getByRole("checkbox");
  return {
    getComponent: () => component,
    getAllDayLabel: () => within(component).getByText(/all day/i),
    getTitle: (title: string) => within(component).getByText(title),
    getCheckbox: () => within(component).getByRole("checkbox"),
    clickCheckbox: () =>
      fireEvent.click(within(component).getByRole("checkbox")),
    getTimeLabel: (time: string) => within(component).getByText(time),
    checkboxIsPrimary: () => {
      return getCheckbox().className.includes(
        "border-primary data-[state=checked]:bg-primary"
      );
    },
    checkboxIsSecondary: () => {
      return getCheckbox().className.includes(
        "border-secondary data-[state=checked]:bg-secondary"
      );
    },
  };
};
