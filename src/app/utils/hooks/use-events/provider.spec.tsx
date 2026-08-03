import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";
import { generateListOfEvents } from "../../mocks/event";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useEventsState } from "./state-context";
import { EventsContextProvider } from "./provider";
import { useEventsActions } from "./actions-context";
import { EventStatus, IEvent } from "../../types/event";
import { DEFAULT_TEST_DATE } from "../../mocks/date";
import { EVENTS_PATH, getEventsPath } from "./api";

describe("EventsContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch events and update the state", async () => {
    const mockData = generateListOfEvents(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useEventsState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((event) => <div key={event.id}>{event.title}</div>)}
        </div>
      );
    };

    render(
      <EventsContextProvider>
        <TestComponent />
      </EventsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Event 0")).resolves.toBeInTheDocument(),
    );
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(EVENTS_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useEventsState();
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
      <EventsContextProvider>
        <TestComponent />
      </EventsContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.get).toHaveBeenCalledWith(EVENTS_PATH);
  });

  it("should create an event and update the state", async () => {
    const mockEvent: Omit<IEvent, "id"> = {
      title: "new event",
      description: "",
      status: EventStatus.Pending,
      project_id: null,
      start_at: DEFAULT_TEST_DATE,
      end_at: DEFAULT_TEST_DATE,
      created_at: DEFAULT_TEST_DATE,
      all_day: false,
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useEventsState();
      const { create: createEvent } = useEventsActions();
      return (
        <div>
          <button onClick={() => createEvent(mockEvent)}>Create Event</button>
          <div>
            {data.map((event) => (
              <div key={event.id}>{event.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <EventsContextProvider>
          <TestComponent />
        </EventsContextProvider>
      </ToastProvider>,
    );

    expect(screen.queryByText("new event")).not.toBeInTheDocument();
    // Simulate clicking the "Create Event" button
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new event")).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.post).toHaveBeenCalledWith(EVENTS_PATH, mockEvent);
  });

  it("should delete an event and update the state", async () => {
    const events = generateListOfEvents(2);

    mockAxios.get.mockResolvedValueOnce({ data: events });

    const TestComponent = () => {
      const { data } = useEventsState();
      const { delete: deleteEvent } = useEventsActions();
      return (
        <div>
          <div>
            {data.map((event) => (
              <div key={event.id}>
                <div>{event.title}</div>
                <button onClick={() => deleteEvent(event.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <EventsContextProvider>
          <TestComponent />
        </EventsContextProvider>
      </ToastProvider>,
    );

    await expect(screen.findByText("Event 0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Event 1")).resolves.toBeInTheDocument();

    // Simulate clicking the "Create Event" button
    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("Event 1")).resolves.toBeInTheDocument(),
    );
    expect(screen.queryByText("Event 0")).not.toBeInTheDocument();
    expect(mockAxios.delete).toHaveBeenCalledWith(getEventsPath(0));
  });
});
