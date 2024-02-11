import { act, waitFor, cleanup } from "@testing-library/react";

import JournalEntryForm, { JournalEntryFormProps } from "./JournalEntryForm";
import { getJournalEntryFormTestkit } from "./JournalEntryForm.testkit";
import { render } from "@/config/utils/test-utils";
import MockAxios from "jest-mock-axios";

describe("JournalEntryForm", () => {
  const defaultProps: JournalEntryFormProps = {};
  const renderComponent = (props: JournalEntryFormProps = defaultProps) =>
    getJournalEntryFormTestkit(
      render(<JournalEntryForm {...props} />).container
    );

  afterEach(() => {
    MockAxios.reset();
    cleanup();
  });

  it("should render JournalEntryForm", () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it("should show textbox and submit button", () => {
    const wrapper = renderComponent();
    expect(wrapper.getTextarea().getComponent()).toBeInTheDocument();
    expect(wrapper.getSubmitButton()).toBeInTheDocument();
  });

  it('should disable "Create" button until text is entered', async () => {
    const wrapper = renderComponent();
    expect(wrapper.getSubmitButton()).toBeDisabled();
    act(() => {
      wrapper.getTextarea().enterValue("note");
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
  });

  it("should submit entry", async () => {
    const newText = "<p>test</p><p>note</p>";

    const wrapper = renderComponent(defaultProps);
    act(() => {
      wrapper.getTextarea().enterValue(newText);
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
    wrapper.clickButton();
    await waitFor(() => {
      expect(MockAxios.post).toHaveBeenCalledWith("/api/entries", {
        note: newText,
        tags: [],
        title: "test",
      });
    });
  });

  it("should submit entry, on Ctrl + Enter", async () => {
    const newText = "<p>test</p><p>note</p>";

    const wrapper = renderComponent(defaultProps);
    act(() => {
      wrapper.getTextarea().enterValue(newText);
    });
    await waitFor(() => {
      expect(wrapper.getSubmitButton()).not.toBeDisabled();
    });
    wrapper.getTextarea().pressCtrlEnter();
    await waitFor(() => {
      expect(MockAxios.post).toHaveBeenCalledWith("/api/entries", {
        note: "<p>test</p><p>note<br></p>",
        tags: [],
        title: "test",
      });
    });
  });
});
