import { within } from "@testing-library/react";
import { getMinimalNoteTestkit } from "../MinimalNote/MinimalNote.testkit";
import { minimalNoteTestId } from "./TaskForm";

export const getTaskFormTestkit = (component: HTMLElement) => ({
  getComponent: () => component,

  getTitleInputExists: () =>
    within(component).getAllByRole("textbox", { name: /title/i }).length === 1,
  getTitleInputValue: () =>
    within(component)
      .getByRole("textbox", { name: /title/i })
      .getAttribute("value"),

  getETAFieldExists: () =>
    within(component).getAllByRole("spinbutton", { name: /ETA/i }).length === 1,
  getEtaInputValue: () =>
    within(component)
      .getByRole("spinbutton", { name: /ETA/i })
      .getAttribute("value"),

  getProjectFieldExists: () =>
    within(component).getAllByRole("combobox", { name: /project/i }).length ===
    1,
  getProjectInputValue: () =>
    within(component).getByRole("combobox", { name: /project/i }).textContent,

  getCreateButtonExists: () =>
    within(component).getAllByRole("button", { name: /create/i }).length === 1,

  getDesriptionInputExists: () =>
    within(component).getAllByTestId(minimalNoteTestId).length === 1,
  getDescriptionInputValue: () =>
    getMinimalNoteTestkit(within(component).getByTestId(minimalNoteTestId))
      .getTextarea()
      .getTextarea()?.textContent,
});
