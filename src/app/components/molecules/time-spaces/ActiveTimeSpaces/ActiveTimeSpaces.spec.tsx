import { render, screen, waitFor } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";

import { CalendarDateContextProvider } from "@/app/utils/hooks/use-calendar-date";
import { TIME_SPACES_PATH } from "@/app/utils/hooks/use-time-spaces/api";
import { TimeSpacesContextProvider } from "@/app/utils/hooks/use-time-spaces/provider";
import {
  generateDateRangeTimeSpace,
  generateYearlyMonthTimeSpace,
} from "@/app/utils/mocks/time-space";
import { ITimeSpace } from "@/app/utils/types/time-space";

import { ActiveTimeSpaces } from "./ActiveTimeSpaces";

// the mocked clock sits on 1970-01-11, and nothing selects another day here,
// so that is the calendar's selected date throughout
jest.mock("@/app/utils/date/now");

const TRIP = generateDateRangeTimeSpace(1, {
  title: "Trip to Vilnius",
  params: { start: "1970-01-10", end: "1970-01-12" },
});

const APPOINTMENT = generateDateRangeTimeSpace(2, {
  title: "Dentist",
  params: { start: "1970-01-11", end: "1970-01-11" },
});

const JANUARY = generateYearlyMonthTimeSpace(3, {
  title: "Deep winter",
  params: { month: 1 },
});

const DECEMBER = generateYearlyMonthTimeSpace(4, {
  title: "Christmas mood",
  params: { month: 12 },
});

const NEXT_YEAR = generateDateRangeTimeSpace(5, {
  title: "Trip to Vienna",
  params: { start: "2026-11-26", end: "2026-11-28" },
});

const renderStrip = () =>
  render(
    <TimeSpacesContextProvider>
      <CalendarDateContextProvider>
        <ActiveTimeSpaces testId="strip" />
      </CalendarDateContextProvider>
    </TimeSpacesContextProvider>
  );

const respondWith = async (data: ITimeSpace[]) => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));

  mockAxios.mockResponseFor({ url: TIME_SPACES_PATH }, { data });
};

describe("ActiveTimeSpaces", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should show only the time spaces covering the selected day", async () => {
    renderStrip();
    await respondWith([TRIP, APPOINTMENT, JANUARY, DECEMBER, NEXT_YEAR]);

    await expect(screen.findByText(TRIP.title)).resolves.toBeInTheDocument();
    expect(screen.getByText(APPOINTMENT.title)).toBeInTheDocument();
    expect(screen.getByText(JANUARY.title)).toBeInTheDocument();

    expect(screen.queryByText(DECEMBER.title)).not.toBeInTheDocument();
    expect(screen.queryByText(NEXT_YEAR.title)).not.toBeInTheDocument();
  });

  it("should put specific windows before seasonal ones", async () => {
    renderStrip();
    await respondWith([JANUARY, TRIP, APPOINTMENT]);

    await expect(screen.findByText(TRIP.title)).resolves.toBeInTheDocument();

    expect(screen.getByTestId("strip").textContent).toBe(
      `${APPOINTMENT.title}${TRIP.title}day 2 of 3${JANUARY.title}`
    );
  });

  it("should say where in a multi day window the selected day falls", async () => {
    renderStrip();
    await respondWith([TRIP, APPOINTMENT]);

    await expect(screen.findByText("day 2 of 3")).resolves.toBeInTheDocument();
    // a one day window is always "day 1 of 1", so it says nothing
    expect(screen.queryByText("day 1 of 1")).not.toBeInTheDocument();
  });

  it("should render nothing on a day no time space covers", async () => {
    renderStrip();
    await respondWith([DECEMBER, NEXT_YEAR]);

    await waitFor(() =>
      expect(screen.queryByTestId("strip")).not.toBeInTheDocument()
    );
  });
});
