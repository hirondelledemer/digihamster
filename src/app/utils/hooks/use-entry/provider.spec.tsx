import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useEntriesState } from "./state-context";
import { EntriesContextProvider } from "./provider";
import { useEntriesActions } from "./actions-context";
import { generateListOfJournalEntries } from "../../mocks/journal-entry";
import { CreateEntryRequestParams, JOURNAL_ENTRIES_PATH } from "./api";

describe("EntriesContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch entries and update the state", async () => {
    const mockData = generateListOfJournalEntries(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useEntriesState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((entry) => <div key={entry.id}>{entry.title}</div>)}
        </div>
      );
    };

    render(
      <EntriesContextProvider>
        <TestComponent />
      </EntriesContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Entry 0")).resolves.toBeInTheDocument()
    );
    expect(screen.getByText("Entry 1")).toBeInTheDocument();
    expect(screen.getByText("Entry 2")).toBeInTheDocument();
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useEntriesState();
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
      <EntriesContextProvider>
        <TestComponent />
      </EntriesContextProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument()
    );
  });

  it("should create an entry and update the state", async () => {
    const mockEntry: CreateEntryRequestParams = {
      title: "new entry",
      note: "",
      json_note: {},
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useEntriesState();
      const { create: createEntry } = useEntriesActions();
      return (
        <div>
          <button onClick={() => createEntry(mockEntry)}>Create Entry</button>
          <div>
            {data.map((entry) => (
              <div key={entry.id}>{entry.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <EntriesContextProvider>
          <TestComponent />
        </EntriesContextProvider>
      </ToastProvider>
    );

    expect(screen.queryByText("new entry")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new entry")).resolves.toBeInTheDocument()
    );
    expect(mockAxios.post).toHaveBeenCalledWith(
      JOURNAL_ENTRIES_PATH,
      mockEntry
    );
  });
});
