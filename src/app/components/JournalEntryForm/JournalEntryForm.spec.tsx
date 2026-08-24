import JournalEntryForm, {
  JournalEntryFormProps,
  rteTestId,
} from "./JournalEntryForm";
import { render, screen, waitFor } from "@/config/utils/test-utils";
import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import MockAxios from "jest-mock-axios";

import * as toastHook from "../ui/use-toast";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { fireEvent } from "@storybook/test";
import { JOURNAL_ENTRIES_PATH } from "@/app/utils/hooks/use-entry/api";
jest.mock("../ui/use-toast");

const mockUseToast = jest.mocked(toastHook.useToast);

describe("JournalEntryForm", () => {
  const toastSpy = jest.fn();
  const defaultProps: JournalEntryFormProps = {};
  const renderComponent = (props: JournalEntryFormProps = defaultProps) =>
    render(
      <EntriesContextProvider>
        <JournalEntryForm {...props} />
      </EntriesContextProvider>,
    );

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: toastSpy } as any);
  });

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
    expect(toastSpy).toHaveBeenCalledWith({
      title: "Success",
      description: "Entry has been created",
    });
  });
});
