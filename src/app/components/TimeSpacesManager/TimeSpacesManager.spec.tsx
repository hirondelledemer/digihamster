import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import mockAxios from "jest-mock-axios";

import { TimeSpacesContextProvider } from "@/app/utils/hooks/use-time-spaces/provider";
import { TIME_SPACES_PATH } from "@/app/utils/hooks/use-time-spaces/api";
import {
  generateDateRangeTimeSpace,
  generateYearlyMonthTimeSpace,
} from "@/app/utils/mocks/time-space";
import { ITimeSpace, TimeSpaceKind } from "@/app/utils/types/time-space";

import TimeSpacesManager from "./TimeSpacesManager";

// the mocked clock sits on 1970-01-11, which is why "Right now" below is the
// only fixture that comes out active
jest.mock("../../utils/date/now");

const TRIP = generateDateRangeTimeSpace(1, {
  title: "Trip to Vilnius",
  params: { start: "2026-11-26", end: "2026-11-28" },
});

const RIGHT_NOW = generateDateRangeTimeSpace(2, {
  title: "Right now",
  params: { start: "1970-01-01", end: "1970-12-31" },
});

const CHRISTMAS = generateYearlyMonthTimeSpace(3, {
  title: "Christmas mood",
  params: { month: 12 },
});

const DEFAULT_TIME_SPACES: ITimeSpace[] = [TRIP, RIGHT_NOW, CHRISTMAS];

const renderManager = () =>
  render(
    <TimeSpacesContextProvider>
      <TimeSpacesManager />
    </TimeSpacesContextProvider>
  );

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));

  mockAxios.mockResponseFor(
    { url: TIME_SPACES_PATH },
    { data: DEFAULT_TIME_SPACES }
  );

  await expect(screen.findByText(TRIP.title)).resolves.toBeInTheDocument();
};

describe("TimeSpacesManager", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should list time spaces with their window", async () => {
    renderManager();
    await assertLoaded();

    expect(screen.getByText("Nov 26, 2026 - Nov 28, 2026")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 1970 - Dec 31, 1970")).toBeInTheDocument();
    expect(screen.getByText("Every December")).toBeInTheDocument();
  });

  it("should mark only the time space covering today as active", async () => {
    renderManager();
    await assertLoaded();

    const active = screen.getAllByText("Active now");
    expect(active).toHaveLength(1);

    // active ones sort to the top
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual([RIGHT_NOW.title, CHRISTMAS.title, TRIP.title]);
  });

  it("should delete a time space", async () => {
    renderManager();
    await assertLoaded();

    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    await waitFor(() =>
      expect(mockAxios.delete).toHaveBeenCalledWith(
        `${TIME_SPACES_PATH}/${RIGHT_NOW.id}`
      )
    );
    expect(screen.queryByText(RIGHT_NOW.title)).not.toBeInTheDocument();
  });

  it("should create a date range time space defaulting to today", async () => {
    renderManager();
    await assertLoaded();

    await userEvent.click(screen.getByRole("button", { name: "New time space" }));

    await userEvent.type(screen.getByPlaceholderText("Title"), "Long weekend");
    await userEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() =>
      expect(mockAxios.post).toHaveBeenCalledWith(TIME_SPACES_PATH, {
        title: "Long weekend",
        color: undefined,
        kind: TimeSpaceKind.DateRange,
        params: { start: "1970-01-11", end: "1970-01-11" },
      })
    );
  });
});
