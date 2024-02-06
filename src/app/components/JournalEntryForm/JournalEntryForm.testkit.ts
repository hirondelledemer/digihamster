import { fireEvent, within } from "@testing-library/react";
import { rteTestId } from "./JournalEntryForm";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";

// todo: make generic testkit factory
export const getJournalEntryFormTestkit = (component: HTMLElement) => {
  // const getSubmitButton = () =>
  //   within(component).queryByRole('button', { name: /create/i });
  // const getSaveButton = () =>
  //   within(component).queryByRole('button', { name: /save/i });
  // const getDeleteButton = () =>
  //   within(component).queryByRole('button', { name: /delete/i });
  return {
    getComponent: () => component,
    // getTextarea: () => {
    //   const textarea = within(component).queryByTestId(rteTestId);
    //   if (!textarea) {
    //     throw Error("textarea not found");
    //   }
    //   return getRichTextEditorTestkit(textarea);
    // },
    // getSubmitButton,
    // getSaveButton,
    // getDeleteButton,
    // clickButton: () => {
    //   const element = getSubmitButton();
    //   if (!element) {
    //     throw Error("element not found");
    //   }
    //   fireEvent.click(element);
    // },
    // clickSaveButton: () => {
    //   const element = getSaveButton();
    //   if (!element) {
    //     throw Error("element not found");
    //   }
    //   fireEvent.click(element);
    // },
    // clickDeleteButton: () => {
    //   const element = getDeleteButton();
    //   if (!element) {
    //     throw Error("element not found");
    //   }
    //   fireEvent.click(element);
    // },
  };
};
