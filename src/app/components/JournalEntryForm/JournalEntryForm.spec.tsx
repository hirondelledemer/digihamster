import { act, waitFor } from "@testing-library/react";

import JournalEntryForm, { JournalEntryFormProps } from "./JournalEntryForm";
import { getJournalEntryFormTestkit } from "./JournalEntryForm.testkit";
import { render } from "@/config/utils/test-utils";
import MockAxios from "jest-mock-axios";

import * as toastHook from "../ui/use-toast";
jest.mock("../ui/use-toast");
const mockUseToast = jest.mocked(toastHook.useToast);

describe("JournalEntryForm", () => {
  const toastSpy = jest.fn();
  const defaultProps: JournalEntryFormProps = {};
  const renderComponent = (props: JournalEntryFormProps = defaultProps) =>
    getJournalEntryFormTestkit(
      render(<JournalEntryForm {...props} />).container
    );

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: toastSpy } as any);
  });

  afterEach(() => {
    MockAxios.reset();
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
    MockAxios.post.mockResolvedValueOnce({ data: {} });

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
    expect(toastSpy).toHaveBeenCalledWith({
      title: "Success",
      description: "Note has been submitted",
    });
  });

  describe("error", () => {
    it("should show an error", async () => {
      const newText = "<p>test</p><p>note</p>";
      MockAxios.post.mockRejectedValueOnce({ data: {} });

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
      expect(toastSpy).toHaveBeenCalledWith({
        description: '{"data":{}}',
        title: "Error",
        variant: "destructive",
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
