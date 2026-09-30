import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useLocationsState } from "./state-context";
import { LocationsContextProvider } from "./provider";
import { useLocationsActions } from "./actions-context";
import { CreateLocationParams, LOCATIONS_PATH } from "./api";
import { generateListOfLocations } from "../../mocks/location";

describe("LocationsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch locations and update the state", async () => {
    const mockData = generateListOfLocations(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useLocationsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((location) => (
                <div key={location.id}>{location.title}</div>
              ))}
        </div>
      );
    };

    render(
      <LocationsContextProvider>
        <TestComponent />
      </LocationsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Location 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Location 1")).toBeInTheDocument();
    expect(screen.getByText("Location 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(LOCATIONS_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useLocationsState();
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
      <LocationsContextProvider>
        <TestComponent />
      </LocationsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
  });

  it("should create a location and update the state", async () => {
    const mockLocation: CreateLocationParams = {
      title: "new location",
      color: "color1",
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useLocationsState();
      const { create: createLocation } = useLocationsActions();
      return (
        <div>
          <button onClick={() => createLocation(mockLocation)}>
            Create Location
          </button>
          <div>
            {data.map((location) => (
              <div key={location.id}>{location.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <LocationsContextProvider>
          <TestComponent />
        </LocationsContextProvider>
      </ToastProvider>
    );

    expect(screen.queryByText("new location")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new location")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith(LOCATIONS_PATH, mockLocation);
  });
});
