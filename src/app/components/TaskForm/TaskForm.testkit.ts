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

    // if (!input) {
    //   throw new Error("title input was not found");
    // }
    fireEvent.change(input, { target: { value } });
  },

  getETAFieldExists: () =>
    within(component).getAllByRole("spinbutton", { name: /ETA/i }).length === 1,
  getEtaInputValue: () =>
    within(component)
      .getByRole("spinbutton", { name: /ETA/i })
      .getAttribute("value"),
  setEta: (value: number) => {
    const input = within(component).getByRole("spinbutton", { name: /ETA/i });
    fireEvent.change(input, { target: { value } });
  },

  getProjectFieldExists: () =>
    within(component).getAllByRole("combobox", { name: /project/i }).length ===
    1,
  getProjectInputValue: () =>
    within(component).getByRole("combobox", { name: /project/i }).textContent,
  setProject: (value: string) => {
    const input = within(component).getByRole("combobox", { name: /project/i });
    fireEvent.click(input);
    // console.log("jere");
    // screen.logTestingPlaygroundURL();
    // const option = within(component).getAllByRole("option");
    // fireEvent.click(option[0]);
    // fireEvent.change(input, { target: { value } });
  },

  optionExists: (optionLabel: string) =>
    within(component).getAllByText(optionLabel).length === 1,
  clickOption: (optionLabel: string) => {
    const option = within(component).getByText(optionLabel);
    fireEvent.click(option);
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
  setDescription: (value: string) =>
    getMinimalNoteTestkit(within(component).getByTestId(minimalNoteTestId))
      .getTextarea()
      .enterValue(value),
});
