import JournalEntryForm, {
  eventBadgeTestId,
  noEventBadgeTestId,
  rteTestId,
} from "./JournalEntryForm";
import { render, screen, waitFor } from "@/config/utils/test-utils";
import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import MockAxios from "jest-mock-axios";

import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { fireEvent } from "@storybook/test";
import { JOURNAL_ENTRIES_PATH } from "@/app/utils/hooks/use-entry/api";
import {
  useCurrentEvent,
  useEventsForDay,
} from "../../utils/hooks/use-events/selectors";
import { generateEvent } from "@/app/utils/mocks/event";
import { RELATIONSHIPS_PATH } from "@/app/utils/hooks/use-relationships/api";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

// the selectors have their own spec — here they are the knobs that decide what
// the form is given, so the form's own behaviour can be checked in isolation
jest.mock("../../utils/hooks/use-events/selectors", () => ({
  useEventsForDay: jest.fn(),
  useCurrentEvent: jest.fn(),
}));

const mockedUseEventsForDay = useEventsForDay as jest.Mock;
const mockedUseCurrentEvent = useCurrentEvent as jest.Mock;

describe("JournalEntryForm", () => {
  const renderComponent = () =>
    render(
      <EntriesContextProvider>
        <JournalEntryForm />
      </EntriesContextProvider>,
    );

  const getCreateButton = () =>
    screen.getByRole("button", { name: /create/i });

  const enterNote = async (text: string) => {
    const rteWrapper = getRichTextEditorTestkit(screen.getByTestId(rteTestId));
    rteWrapper.enterValue(text);

    await waitFor(() => {
      expect(getCreateButton()).not.toBeDisabled();
    });
  };

  beforeEach(() => {
    mockedUseEventsForDay.mockReturnValue([]);
    mockedUseCurrentEvent.mockReturnValue(undefined);
  });

  afterEach(() => {
    MockAxios.reset();
  });

  it("should show textbox and submit button", () => {
    renderComponent();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    expect(rteWrapper.getTextarea()).toBeInTheDocument();
    expect(getCreateButton()).toBeInTheDocument();
  });

  it('should disable "Create" button until text is entered', async () => {
    renderComponent();
    expect(getCreateButton()).toBeDisabled();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    rteWrapper.enterValue("note");

    await waitFor(() => {
      expect(getCreateButton()).not.toBeDisabled();
    });
  });

  it("should submit entry", async () => {
    const newText = "<p>test</p><p>note</p>";
    MockAxios.post.mockResolvedValueOnce({ data: {} });

    renderComponent();

    await enterNote(newText);

    fireEvent.click(getCreateButton());

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

  describe("calendar event selection", () => {
    const standup = generateEvent(1, { title: "Standup" });
    const review = generateEvent(2, { title: "Design review" });
    const createdEntry = { id: 55, title: "note", note: "note" };

    describe("today events do not exists", () => {
      it("should not show any events, only 'no event' option", () => {
        renderComponent();

        expect(screen.getByTestId(noEventBadgeTestId)).toBeInTheDocument();
        expect(screen.queryAllByTestId(eventBadgeTestId)).toHaveLength(0);
      });
    });

    describe("today events exists, but there is not current event", () => {
      beforeEach(() => {
        mockedUseEventsForDay.mockReturnValue([standup, review]);
      });

      it("should render the today events", () => {
        renderComponent();

        expect(
          screen
            .getAllByTestId(eventBadgeTestId)
            .map((badge) => badge.textContent),
        ).toEqual([standup.title, review.title]);
      });

      it('should preselect "no event" option', () => {
        renderComponent();

        expect(screen.getByTestId(noEventBadgeTestId)).toHaveAttribute(
          "data-selected",
          "true",
        );
        screen.getAllByTestId(eventBadgeTestId).forEach((badge) => {
          expect(badge).toHaveAttribute("data-selected", "false");
        });
      });

      it("should submit journal with no relationship", async () => {
        MockAxios.post.mockResolvedValueOnce({ data: createdEntry });

        renderComponent();

        await enterNote("<p>note</p>");
        fireEvent.click(getCreateButton());

        await waitFor(() => {
          expect(MockAxios.post).toHaveBeenCalledWith(
            JOURNAL_ENTRIES_PATH,
            expect.anything(),
          );
        });
        expect(MockAxios.post).toHaveBeenCalledTimes(1);
      });
    });

    describe("current event exists", () => {
      beforeEach(() => {
        mockedUseEventsForDay.mockReturnValue([standup, review]);
        mockedUseCurrentEvent.mockReturnValue(review);
      });

      it("should preselect current event", () => {
        renderComponent();

        expect(screen.getByTestId(noEventBadgeTestId)).toHaveAttribute(
          "data-selected",
          "false",
        );

        const [standupBadge, reviewBadge] =
          screen.getAllByTestId(eventBadgeTestId);
        expect(standupBadge).toHaveAttribute("data-selected", "false");
        expect(reviewBadge).toHaveAttribute("data-selected", "true");
      });

      it("should submit journal and a new relationship to the event", async () => {
        MockAxios.post
          .mockResolvedValueOnce({ data: createdEntry })
          .mockResolvedValueOnce({ data: { id: 1 } });

        renderComponent();

        await enterNote("<p>note</p>");
        fireEvent.click(getCreateButton());

        await waitFor(() => {
          expect(MockAxios.post).toHaveBeenCalledWith(RELATIONSHIPS_PATH, {
            source_id: review.id,
            source_type: RelationshipEntityType.Event,
            target_id: createdEntry.id,
            target_type: RelationshipEntityType.Journal,
          });
        });
      });
    });
  });
});
