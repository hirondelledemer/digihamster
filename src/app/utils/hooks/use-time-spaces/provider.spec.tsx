import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { TimeSpaceKind } from "../../types/time-space";
import { generateListOfTimeSpaces } from "../../mocks/time-space";
import { useTimeSpacesState } from "./state-context";
import { TimeSpacesContextProvider } from "./provider";
import { useTimeSpacesActions } from "./actions-context";
import { CreateTimeSpaceParams, TIME_SPACES_PATH } from "./api";

describe("TimeSpacesContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch time spaces and update the state", async () => {
    const mockData = generateListOfTimeSpaces(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useTimeSpacesState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((timeSpace) => (
                <div key={timeSpace.id}>{timeSpace.title}</div>
              ))}
        </div>
      );
    };

    render(
      <TimeSpacesContextProvider>
        <TestComponent />
      </TimeSpacesContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Time space 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Time space 1")).toBeInTheDocument();
    expect(screen.getByText("Time space 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(TIME_SPACES_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useTimeSpacesState();
      return (
        <div>
          {isLoading ? (
            "Loading..."
          ) : (
            <div>Error: {errorMessage?.toString()}</div>
          )}
        </div>
      );
    };

    render(
      <TimeSpacesContextProvider>
        <TestComponent />
      </TimeSpacesContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
  });

  it("should create a time space and update the state", async () => {
    const mockTimeSpace: CreateTimeSpaceParams = {
      title: "new time space",
      color: "#FF6B6B",
      kind: TimeSpaceKind.YearlyMonth,
      params: { month: 12 },
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useTimeSpacesState();
      const { create: createTimeSpace } = useTimeSpacesActions();
      return (
        <div>
          <button onClick={() => createTimeSpace(mockTimeSpace)}>
            Create Time Space
          </button>
          <div>
            {data.map((timeSpace) => (
              <div key={timeSpace.id}>{timeSpace.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TimeSpacesContextProvider>
          <TestComponent />
        </TimeSpacesContextProvider>
      </ToastProvider>
    );

    expect(screen.queryByText("new time space")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new time space")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith(TIME_SPACES_PATH, mockTimeSpace);
  });
});
