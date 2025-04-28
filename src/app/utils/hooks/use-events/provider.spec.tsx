import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";
import { generateListOfEvents } from "../../mocks/event";
import { Event } from "@/models/event";
import { HOUR } from "../../consts/dates";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useEventsState } from "./state-context";
import { EventsContextProvider } from "./provider";
import { useEventsActions } from "./actions-context";

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
            : data.map((event) => <div key={event._id}>{event.title}</div>)}
        </div>
      );
    };

    render(
      <EventsContextProvider>
        <TestComponent />
      </EventsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Event 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith("/api/events");
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
      </EventsContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
    expect(mockAxios.get).toHaveBeenCalledWith("/api/events");
  });

  it("should create an event and update the state", async () => {
    const mockEvent: Omit<Event, "_id"> = {
      title: "new event",
      description: "",
      completed: false,
      deleted: false,
      projectId: "",
      allDay: false,
      startAt: 0,
      endAt: HOUR,
      tags: [],
      updatedAt: "",
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
              <div key={event._id}>{event.title}</div>
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
      </ToastProvider>
    );

    expect(screen.queryByText("new event")).not.toBeInTheDocument();
    // Simulate clicking the "Create Event" button
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new event")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith("/api/events", mockEvent);
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
              <div key={event._id}>
                <div>{event.title}</div>
                <button onClick={() => deleteEvent(event._id)}>Delete</button>
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
      </ToastProvider>
    );

    await expect(screen.findByText("Event 0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Event 1")).resolves.toBeInTheDocument();

    // Simulate clicking the "Create Event" button
    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("Event 1")).resolves.toBeInTheDocument()
    );
    expect(screen.queryByText("Event 0")).not.toBeInTheDocument();
    expect(mockAxios.patch).toHaveBeenCalledWith("/api/events", {
      deleted: true,
      eventId: events[0]._id,
    });
  });
});
