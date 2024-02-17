import { within } from "@testing-library/react";
import { getMinimalNoteTestkit } from "../MinimalNote/MinimalNote.testkit";
import { minimalNoteTestId } from "./TaskForm";

export const getTaskFormTestkit = (component: HTMLElement) => ({
  getComponent: () => component,
  getTitleInputExists: () =>
    within(component).getAllByRole("textbox", { name: /title/i }).length === 1,
  getETAFieldExists: () =>
    within(component).getAllByRole("spinbutton", { name: /ETA/i }).length === 1,
  getProjectFieldExists: () =>
    within(component).getAllByRole("combobox", { name: /project/i }).length ===
    1,
  getCreateButtonExists: () =>
    within(component).getAllByRole("button", { name: /create/i }).length === 1,
  getDesriptionInputExists: () =>
    within(component).getAllByTestId(minimalNoteTestId).length === 1,
});
