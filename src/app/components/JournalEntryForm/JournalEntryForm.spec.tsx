import JournalEntryForm, {
  eventBadgeTestId,
  noEventBadgeTestId,
  rteTestId,
} from "./JournalEntryForm";
import { act, render, screen, waitFor } from "@/config/utils/test-utils";
import { EntriesContextProvider } from "@/app/utils/hooks/use-entry/provider";
import { EventsContextProvider } from "@/app/utils/hooks/use-events/provider";
import mockAxios from "jest-mock-axios";

import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import { fireEvent } from "@storybook/test";
import { JOURNAL_ENTRIES_PATH } from "@/app/utils/hooks/use-entry/api";
import { EVENTS_PATH } from "@/app/utils/hooks/use-events/api";
import { RELATIONSHIPS_PATH } from "@/app/utils/hooks/use-relationships/api";
import { RelationshipsContextProvider } from "@/app/utils/hooks/use-relationships/provider";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { generateEvent } from "@/app/utils/mocks/event";
import { IEvent } from "@/app/utils/types/event";
import { DEFAULT_TEST_DATE } from "@/app/utils/mocks/date";
import { toBackendDateTime } from "#utils/date";
import { addMinutes, subMinutes } from "date-fns";

jest.mock("../../utils/date/now");

// now() is mocked to DEFAULT_TEST_DATE, so the events are placed around it.
// They stay within an hour of it on purpose: that keeps them on the same
// calendar day as "now" in whichever timezone the suite runs in
const NOW = new Date(DEFAULT_TEST_DATE);

const STANDUP = generateEvent(1, {
  title: "Standup",
  start_at: toBackendDateTime(subMinutes(NOW, 60)),
  end_at: toBackendDateTime(subMinutes(NOW, 45)),
});
const REVIEW = generateEvent(2, {
  title: "Design review",
  start_at: toBackendDateTime(subMinutes(NOW, 15)),
  end_at: toBackendDateTime(addMinutes(NOW, 15)),
});
const RETRO = generateEvent(3, {
  title: "Retro",
  start_at: toBackendDateTime(addMinutes(NOW, 45)),
  end_at: toBackendDateTime(addMinutes(NOW, 60)),
});

const CREATED_ENTRY = { id: 55, title: "note", note: "note" };

describe("JournalEntryForm", () => {
  const renderComponent = () =>
    render(
      <EventsContextProvider>
        <EntriesContextProvider>
          <RelationshipsContextProvider>
            <JournalEntryForm />
          </RelationshipsContextProvider>
        </EntriesContextProvider>
      </EventsContextProvider>,
    );

  const assertLoaded = async (events: IEvent[] = []) => {
    await waitFor(() => expect(mockAxios.queue()).toHaveLength(3));
    await act(async () => {
      mockAxios.mockResponseFor({ url: EVENTS_PATH }, { data: events });
      mockAxios.mockResponseFor({ url: JOURNAL_ENTRIES_PATH }, { data: [] });
      mockAxios.mockResponseFor({ url: RELATIONSHIPS_PATH }, { data: [] });
    });
  };

  const getCreateButton = () => screen.getByRole("button", { name: /create/i });

  const enterNote = async (text: string) => {
    const rteWrapper = getRichTextEditorTestkit(screen.getByTestId(rteTestId));
    rteWrapper.enterValue(text);

    await waitFor(() => {
      expect(getCreateButton()).not.toBeDisabled();
    });
  };

  const submitEntry = async () => {
    fireEvent.click(getCreateButton());

    await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));
    await act(async () => {
      mockAxios.mockResponseFor(
        { url: JOURNAL_ENTRIES_PATH },
        { data: CREATED_ENTRY },
      );
    });
  };

  afterEach(() => {
    mockAxios.reset();
  });

  it("should show textbox and submit button", async () => {
    renderComponent();
    await assertLoaded();

    const rte = screen.getByTestId(rteTestId);
    const rteWrapper = getRichTextEditorTestkit(rte);

    expect(rteWrapper.getTextarea()).toBeInTheDocument();
    expect(getCreateButton()).toBeInTheDocument();
  });

  it('should disable "Create" button until text is entered', async () => {
    renderComponent();
    await assertLoaded();

    expect(getCreateButton()).toBeDisabled();

    await enterNote("note");

    expect(getCreateButton()).not.toBeDisabled();
  });

  it("should submit entry", async () => {
    renderComponent();
    await assertLoaded();

    await enterNote("<p>test</p><p>note</p>");
    await submitEntry();

    expect(mockAxios.post).toHaveBeenCalledWith(JOURNAL_ENTRIES_PATH, {
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

  describe("calendar event selection", () => {
    describe("today events do not exists", () => {
      it("should not show any events, only 'no event' option", async () => {
        renderComponent();
        await assertLoaded([]);

        expect(screen.getByTestId(noEventBadgeTestId)).toBeInTheDocument();
        expect(screen.queryAllByTestId(eventBadgeTestId)).toHaveLength(0);
      });
    });

    describe("today events exists, but there is not current event", () => {
      // neither event is running at the mocked now()
      const events = [STANDUP, RETRO];

      it("should render the today events", async () => {
        renderComponent();
        await assertLoaded(events);

        expect(
          screen
            .getAllByTestId(eventBadgeTestId)
            .map((badge) => badge.textContent),
        ).toEqual([STANDUP.title, RETRO.title]);
      });

      it('should preselect "no event" option', async () => {
        renderComponent();
        await assertLoaded(events);

        expect(screen.getByTestId(noEventBadgeTestId)).toHaveAttribute(
          "data-selected",
          "true",
        );
        screen.getAllByTestId(eventBadgeTestId).forEach((badge) => {
          expect(badge).toHaveAttribute("data-selected", "false");
        });
      });

      it("should submit journal with no relationship", async () => {
        renderComponent();
        await assertLoaded(events);

        await enterNote("<p>note</p>");
        await submitEntry();

        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith(
          JOURNAL_ENTRIES_PATH,
          expect.anything(),
        );
      });
    });

    describe("current event exists", () => {
      // REVIEW runs from 15 minutes before now() to 15 minutes after
      const events = [STANDUP, REVIEW];

      it("should preselect current event", async () => {
        renderComponent();
        await assertLoaded(events);

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
        renderComponent();
        await assertLoaded(events);

        await enterNote("<p>note</p>");
        await submitEntry();

        await waitFor(() => {
          expect(mockAxios.post).toHaveBeenCalledWith(RELATIONSHIPS_PATH, {
            source_id: REVIEW.id,
            source_type: RelationshipEntityType.Event,
            target_id: CREATED_ENTRY.id,
            target_type: RelationshipEntityType.Journal,
          });
        });
      });
    });
  });
});
