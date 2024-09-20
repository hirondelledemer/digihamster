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

  getETAFieldExists: () =>
    within(component).queryAllByRole("group").length === 1,
  getEtaSelectedByName: (name: string) =>
    within(component)
      .getByRole("radio", { name })
      .getAttribute("data-state") === "on",
  setEta: (name: string) => {
    const input = within(component).getByRole("radio", { name });
    fireEvent.click(input);
  },

  getProjectFieldExists: () =>
    within(component).getAllByRole("combobox", { name: /project/i }).length ===
    1,
  getProjectInputValue: () =>
    within(component).getByRole("combobox", { name: /project/i }).textContent,
  getProjectOptions: async () => {
    await userEvent.click(
      within(component).getByRole("combobox", { name: /project/i })
    );
    within(component).getAllByRole("option");
  },
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

  // actions

  deleteButtonExists: () =>
    within(component).queryByRole("button", { name: /delete/i }) !== null,
  clickDeleteButton: () => {
    const button = within(component).getByRole("button", { name: /delete/i });
    fireEvent.click(button);
  },

  completeButtonExists: () =>
    within(component).queryByRole("button", { name: /complete/i }) !== null,
  clickCompleteButton: () => {
    const button = within(component).getByRole("button", { name: /complete/i });
    fireEvent.click(button);
  },

  undoButtonExists: () =>
    within(component).queryByRole("button", { name: /undo/i }) !== null,
  clickUndoButton: () => {
    const button = within(component).getByRole("button", { name: /undo/i });
    fireEvent.click(button);
  },
  ...within(component),
});
