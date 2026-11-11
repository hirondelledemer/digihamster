import { fireEvent, render, screen } from "@/config/utils/test-utils";
import { ActiveContext, eventTitleTestId } from "./ActiveContext";
import { generateEvent } from "@/app/utils/mocks/event";
import { now } from "@/app/utils/date/now";
import { toBackendDateTime } from "#utils/date";
import { addDays, addHours, subHours } from "date-fns";
import { useSearchParams } from "next/navigation";
jest.mock("../../utils/date/now");

const routerPushSpy = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
  useRouter: () => ({
    push: routerPushSpy,
  }),
}));

jest.mock("@/app/utils/url/search-params", () => ({
  useSetSearchParams: jest.fn(() => jest.fn()), // Mocks the hook returning a setter function
}));

import { useSetSearchParams } from "@/app/utils/url/search-params";
import { eventsState, providers } from "@/app/utils/tests/wrappers";
import { IEvent } from "@/app/utils/types/event";
import { QUERY_KEYS } from "@/app/utils/url/constants";

const renderComponent = (events: IEvent[]) => {
  const updateTask = jest.fn();
  const deleteTask = jest.fn();
  const createRelationship = jest.fn();

  render(<ActiveContext />, {
    wrapper: providers(eventsState({ data: events })),
  });

  const openMenu = () => fireEvent.contextMenu(screen.getByText("trigger"));

  return { updateTask, deleteTask, openMenu, createRelationship };
};

describe("ActiveContext", () => {
  beforeEach(() => {
    routerPushSpy.mockReset();
  });

  describe("default view", () => {
    describe("event is is present in query params", () => {
      const EVENT = generateEvent();

      it("should show the event from query params, even if currentEvent is different", async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => String(EVENT.id),
        });

        renderComponent([EVENT]);

        expect(screen.getByTestId(eventTitleTestId)).toHaveTextContent(
          EVENT.title
        );
      });

      it("pressing x would remove the selected event from query params", async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => String(EVENT.id),
        });

        const mockSet = jest.fn();
        (useSetSearchParams as jest.Mock).mockReturnValue(mockSet);

        renderComponent([EVENT]);

        fireEvent.click(screen.getByRole("button", { name: /back/i }));

        expect(mockSet).toHaveBeenCalledWith(QUERY_KEYS.eventId, null);
      });
    });

    describe("current event is present, no query params", () => {
      const TEST_DATE = now();
      const TEST_DATE_START = subHours(TEST_DATE, 1);
      const TEST_DATE_END = addHours(TEST_DATE, 1);
      const CURRENT_EVENT = generateEvent(1, {
        start_at: toBackendDateTime(TEST_DATE_START),
        end_at: toBackendDateTime(TEST_DATE_END),
      });

      it("should show the info of current event", () => {
        renderComponent([CURRENT_EVENT]);

        expect(screen.getByTestId(eventTitleTestId)).toHaveTextContent(
          CURRENT_EVENT.title
        );
      });
    });

    describe("no current event", () => {
      const TEST_DATE = addDays(now(), 3);
      const CURRENT_EVENT = generateEvent(1, {
        start_at: toBackendDateTime(TEST_DATE),
        end_at: toBackendDateTime(TEST_DATE),
      });

      it("should show active tasks", () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => undefined,
        });

        renderComponent([CURRENT_EVENT]);

        expect(screen.queryByText(CURRENT_EVENT.title)).not.toBeInTheDocument();
      });
    });
  });
});
