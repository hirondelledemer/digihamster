import { within, fireEvent, screen } from "@testing-library/react";
import { getMinimalNoteTestkit } from "../MinimalNote/MinimalNote.testkit";
import { minimalNoteTestId } from "./TaskForm";
import { default as fe } from "@testing-library/user-event";

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

  getETAFieldExists: () => within(component).getAllByRole("group").length === 1,
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
  //todo: for some reason this does not work
  setProject: (value: string) => {
    const input = within(component).getByRole("combobox", { name: /project/i });
    fireEvent.click(input, { target: { value } });
  },

  getCreateButtonExists: () =>
    within(component).getAllByRole("button", { name: /create/i }).length === 1,
  clickCreateButton: () => {
    const button = within(component).getByRole("button", { name: /create/i });
    fireEvent.click(button);
  },

  getDesriptionInputExists: () =>
    within(component).getAllByTestId(minimalNoteTestId).length === 1,
  getDescriptionInputValue: () =>
    getMinimalNoteTestkit(within(component).getByTestId(minimalNoteTestId))
      .getTextarea()
      .getTextarea()?.textContent,
  setDescription: (value: string) => {
    const input = getMinimalNoteTestkit(
      within(component).getByTestId(minimalNoteTestId)
    );
    input.getTextarea().enterValue(value);
    input.getTextarea().blur();
  },
});
