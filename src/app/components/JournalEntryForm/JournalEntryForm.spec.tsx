import JournalEntryForm, { rteTestId } from "./JournalEntryForm";
import { render, screen, waitFor } from "@/config/utils/test-utils";
import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import MockAxios from "jest-mock-axios";

import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { fireEvent } from "@storybook/test";
import { JOURNAL_ENTRIES_PATH } from "@/app/utils/hooks/use-entry/api";

describe("JournalEntryForm", () => {
  const renderComponent = () =>
    render(
      <EntriesContextProvider>
        <JournalEntryForm />
      </EntriesContextProvider>,
    );

  afterEach(() => {
    MockAxios.reset();
  });

  it("should show textbox and submit button", () => {
    renderComponent();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    expect(rteWrapper.getTextarea()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  it('should disable "Create" button until text is entered', async () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue("note");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create/i }),
      ).not.toBeDisabled();
    });
  });

  it("should submit entry", async () => {
    const newText = "<p>test</p><p>note</p>";
    MockAxios.post.mockResolvedValueOnce({ data: {} });

    renderComponent();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue(newText);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create/i }),
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(MockAxios.post).toHaveBeenCalledWith(JOURNAL_ENTRIES_PATH, {
        json_note: {
          content: [
            {
              content: [
                {
                  text: "test",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
            {
              content: [
                {
                  text: "note",
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
        note: "note",
        title: "test",
      });
    });
  });
});
