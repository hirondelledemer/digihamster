import { within, fireEvent } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

export const getTaskFormTestkit = (component: HTMLElement) => ({
  getComponent: () => component,

  getTitleInputExists: () =>
    within(component).getAllByRole("textbox", { name: /title/i }).length === 1,
  getTitleInputValue: () =>
    within(component)
      .getByRole("textbox", { name: /title/i })
      .getAttribute("value"),
  setTitle: (value: string) => {
    const input = within(component).getByRole("textbox", { name: /title/i });
    fireEvent.change(input, { target: { value } });
  },

  getProjectFieldExists: () =>
    within(component).getAllByRole("combobox", { name: /project/i }).length ===
    1,
  getProjectInputValue: () =>
    within(component).getByRole("combobox", { name: /project/i }).textContent,
  //todo: for some reason this does not work
  setProject: (value: string) => {
    const input = within(component).getByRole("combobox", { name: /project/i });
    fireEvent.click(input, { target: { value } });
  },

  getCreateButtonExists: () =>
    within(component).queryAllByRole("button", { name: /create/i }).length ===
    1,
  clickCreateButton: () => {
    const button = within(component).getByRole("button", { name: /create/i });
    fireEvent.click(button);
  },

  getEditButtonExists: () =>
    within(component).getAllByRole("button", { name: /save/i }).length === 1,
  clickEditButton: () => {
    const button = within(component).getByRole("button", { name: /save/i });
    fireEvent.click(button);
  },

  getDesriptionInputExists: () =>
    within(component).getAllByRole("textbox", { name: /description/i })
      .length === 1,
  getDescriptionInputValue: () =>
    within(component).getByRole("textbox", { name: /description/i }).innerHTML,
  setDescription: (value: string) => {
    const input = within(component).getByRole("textbox", {
      name: /description/i,
    });
    return userEvent.type(input, value);
  },

  getDeadlineButtonExists: () =>
    within(component).queryAllByRole("button", { name: /deadline/i }).length ===
    1,
});
