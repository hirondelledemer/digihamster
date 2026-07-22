import { render, screen, waitFor } from "@testing-library/react";

import mockAxios from "jest-mock-axios";

import userEvent from "@testing-library/user-event";
import { ToastProvider } from "@/app/components/ui/toast";

import { useNotesState } from "./state-context";
import { NotesContextProvider } from "./provider";
import { useNotesActions } from "./actions-context";
import { generateListOfNotes } from "../../mocks/note";
import { getNotesPath, NOTES_PATH } from "./api";
import { INote } from "../../types/note";

describe("NotesContextProvider", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should fetch notes and update the state", async () => {
    const mockData = generateListOfNotes(3);
    mockAxios.get.mockResolvedValueOnce({ data: mockData });

    const TestComponent = () => {
      const { data, isLoading } = useNotesState();
      return (
        <div>
          {isLoading
            ? "Loading..."
            : data.map((note) => <div key={note.id}>{note.title}</div>)}
        </div>
      );
    };

    render(
      <NotesContextProvider>
        <TestComponent />
      </NotesContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText("Note 0")).resolves.toBeInTheDocument(),
    );
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
    expect(mockAxios.get).toHaveBeenCalledWith(NOTES_PATH);
  });

  it("should handle fetch error and update the state", async () => {
    mockAxios.get.mockRejectedValueOnce(new Error("Internal Server Error"));

    const TestComponent = () => {
      const { errorMessage, isLoading } = useNotesState();
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
      <NotesContextProvider>
        <TestComponent />
      </NotesContextProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.findByText(/Error:/)).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.get).toHaveBeenCalledWith(NOTES_PATH);
  });

  it("should create an note and update the state", async () => {
    const mockNote: Omit<INote, "id"> = {
      title: "new note",
      content: "",
      json_content: {},
      user_id: "",
      deleted: false,
      created_at: "",
    };

    mockAxios.post.mockResolvedValueOnce({ data: [] });

    const TestComponent = () => {
      const { data } = useNotesState();
      const { create: createNote } = useNotesActions();
      return (
        <div>
          <button onClick={() => createNote(mockNote)}>Create Note</button>
          <div>
            {data.map((note) => (
              <div key={note.id}>{note.title}</div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <NotesContextProvider>
          <TestComponent />
        </NotesContextProvider>
      </ToastProvider>,
    );

    expect(screen.queryByText("new note")).not.toBeInTheDocument();
    // Simulate clicking the "Create Note" button
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.findByText("new note")).resolves.toBeInTheDocument(),
    );
    expect(mockAxios.post).toHaveBeenCalledWith(NOTES_PATH, mockNote);
  });

  it("should delete a note and update the state", async () => {
    const notes = generateListOfNotes(2);

    mockAxios.get.mockResolvedValueOnce({ data: notes });

    const TestComponent = () => {
      const { data } = useNotesState();
      const { delete: deleteNote } = useNotesActions();
      return (
        <div>
          <div>
            {data.map((note) => (
              <div key={note.id}>
                <div>{note.title}</div>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <NotesContextProvider>
          <TestComponent />
        </NotesContextProvider>
      </ToastProvider>,
    );

    await expect(screen.findByText("Note 0")).resolves.toBeInTheDocument();
    await expect(screen.findByText("Note 1")).resolves.toBeInTheDocument();

    // Simulate clicking the "Create Note" button
    await userEvent.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(screen.findByText("Note 1")).resolves.toBeInTheDocument(),
    );
    expect(screen.queryByText("Note 0")).not.toBeInTheDocument();
    expect(mockAxios.delete).toHaveBeenCalledWith(getNotesPath(notes[0].id));
  });
});
