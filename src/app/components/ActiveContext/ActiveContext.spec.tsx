import { fireEvent, render, screen } from "@/config/utils/test-utils";
import { ActiveContext } from "./ActiveContext";
import { EventsStateContext } from "@/app/utils/hooks/use-events/state-context";
import { EventsState } from "@/app/utils/hooks/use-events/actions";
import { generateEvent } from "@/app/utils/mocks/event";
import { now } from "@/app/utils/date/now";
import { toBackendDateTime } from "#utils/date";
import { addDays, addHours, subHours } from "date-fns";
import { useSearchParams } from "next/navigation";
jest.mock("../../utils/date/now");

const routerPushSpy = jest.fn();
const routerReplaceSpy = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
  useRouter: () => ({
    replace: routerReplaceSpy,
    push: routerPushSpy,
  }),
}));

describe("ActiveContext", () => {
  describe("default view", () => {
    describe("event is is present in query params", () => {
      const EVENT = generateEvent();
      const contextValue: EventsState = {
        data: [EVENT],
        isLoading: false,
      };

      it("should show the event from query params, even if currentEvent is different", () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => String(EVENT.id),
        });

        render(
          <EventsStateContext.Provider value={contextValue}>
            <ActiveContext />
          </EventsStateContext.Provider>
        );

        expect(screen.getByText(EVENT.title)).toBeInTheDocument();
      });

      it("pressing x would remove the selected sevent from query params", async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => String(EVENT.id),
        });

        render(
          <EventsStateContext.Provider value={contextValue}>
            <ActiveContext />
          </EventsStateContext.Provider>
        );

        fireEvent.click(screen.getByRole("button", { name: /back/i }));

        expect(routerReplaceSpy).toHaveBeenCalledWith("/", undefined);
      });
    });

    describe("current event is present", () => {
      const TEST_DATE = now();
      const TEST_DATE_START = subHours(TEST_DATE, 1);
      const TEST_DATE_END = addHours(TEST_DATE, 1);
      const CURRENT_EVENT = generateEvent(1, {
        start_at: toBackendDateTime(TEST_DATE_START),
        end_at: toBackendDateTime(TEST_DATE_END),
      });
      const contextValue: EventsState = {
        data: [CURRENT_EVENT],
        isLoading: false,
      };

      it("should show the info of current event", () => {
        render(
          <EventsStateContext.Provider value={contextValue}>
            <ActiveContext />
          </EventsStateContext.Provider>
        );

        expect(screen.getByText(CURRENT_EVENT.title)).toBeInTheDocument();
      });

      it("pressing x should show active tasks list", async () => {
        // (useSearchParams as jest.Mock).mockReturnValue({
        //   get: () => String(EVENT.id),
        // });

        render(
          <EventsStateContext.Provider value={contextValue}>
            <ActiveContext />
          </EventsStateContext.Provider>
        );

        fireEvent.click(screen.getByRole("button", { name: /back/i }));

        expect(routerReplaceSpy).not.toHaveBeenCalled();
        expect(screen.queryByText(CURRENT_EVENT.title)).not.toBeInTheDocument();
      });
    });

    describe("no current event", () => {
      const TEST_DATE = addDays(now(), 3);
      const CURRENT_EVENT = generateEvent(1, {
        start_at: toBackendDateTime(TEST_DATE),
        end_at: toBackendDateTime(TEST_DATE),
      });
      const contextValue: EventsState = {
        data: [CURRENT_EVENT],
        isLoading: false,
      };

      it("should show active tasks", () => {
        (useSearchParams as jest.Mock).mockReturnValue({
          get: () => undefined,
        });

        render(
          <EventsStateContext.Provider value={contextValue}>
            <ActiveContext />
          </EventsStateContext.Provider>
        );

        expect(screen.queryByText(CURRENT_EVENT.title)).not.toBeInTheDocument();
      });
    });
  });
});
