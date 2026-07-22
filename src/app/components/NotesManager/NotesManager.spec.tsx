import { render, screen, userEvent, waitFor } from "@/config/utils/test-utils";
import NotesManager, {
  rteCreateNoteTestId,
  rteEditNoteTestId,
} from "./NotesManager";
import { NotesContextProvider } from "@/app/utils/hooks/use-notes/provider";
import { getRichTextEditorTestkit } from "../RichTextEditor/RichTextEditor.testkit";
import mockAxios from "jest-mock-axios";
import { getNotesPath, NOTES_PATH } from "@/app/utils/hooks/use-notes/api";
import { generateListOfNotes } from "@/app/utils/mocks/note";

const DEFAULT_NOTES = generateListOfNotes(3);

const assertLoaded = async () => {
  await waitFor(() => expect(mockAxios.queue()).toHaveLength(1));

  mockAxios.mockResponseFor({ url: NOTES_PATH }, { data: DEFAULT_NOTES });
};

describe("NotesManger", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("should show the form", () => {
    render(
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>,
    );

    expect(screen.getByText("Notes")).toBeInTheDocument();

    expect(screen.getByText("New note")).toBeInTheDocument();
    const rte = screen.getByTestId(rteCreateNoteTestId);
    const rteTestkit = getRichTextEditorTestkit(rte);

    expect(rteTestkit.getComponent()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("should show the notes list", async () => {
    render(
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>,
    );

    await assertLoaded();

    await expect(
      screen.findByText(DEFAULT_NOTES[0].title),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(DEFAULT_NOTES[0].content),
    ).resolves.toBeInTheDocument();

    expect(screen.getByText(DEFAULT_NOTES[1].title)).toBeInTheDocument();
    await expect(
      screen.findByText(DEFAULT_NOTES[1].content),
    ).resolves.toBeInTheDocument();

    expect(screen.getByText(DEFAULT_NOTES[2].title)).toBeInTheDocument();
    await expect(
      screen.findByText(DEFAULT_NOTES[2].content),
    ).resolves.toBeInTheDocument();
  });

  it("should create the note", async () => {
    render(
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>,
    );

    expect(screen.getByText("New note")).toBeInTheDocument();
    const rte = screen.getByTestId(rteCreateNoteTestId);
    const rteTestkit = getRichTextEditorTestkit(rte);

    rteTestkit.enterValue("<p>test</p><p>note</p>");
    rteTestkit.blur();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Create" })).not.toBeDisabled(),
    );

    await userEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(NOTES_PATH, {
        content: "note",
        json_content: {
          content: [
            { content: [{ text: "test", type: "text" }], type: "paragraph" },
            { content: [{ text: "note", type: "text" }], type: "paragraph" },
          ],
          type: "doc",
        },
        title: "test",
      });
    });
  });

  it("should edit the note", async () => {
    render(
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>,
    );

    await assertLoaded();

    await expect(
      screen.findByText(DEFAULT_NOTES[0].title),
    ).resolves.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    const rte = screen.getByTestId(rteEditNoteTestId);
    const rteTestkit = getRichTextEditorTestkit(rte);

    rteTestkit.enterValue("<p>test</p><p>note</p>");
    rteTestkit.blur();

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockAxios.patch).toHaveBeenCalledWith(
        getNotesPath(DEFAULT_NOTES[0].id),
        {
          content: "note",
          json_content: {
            content: [
              { content: [{ text: "test", type: "text" }], type: "paragraph" },
              { content: [{ text: "note", type: "text" }], type: "paragraph" },
            ],
            type: "doc",
          },
          title: "test",
        },
      );
    });
  });

  it("should delete the note", async () => {
    render(
      <NotesContextProvider>
        <NotesManager />
      </NotesContextProvider>,
    );

    await assertLoaded();

    await expect(
      screen.findByText(DEFAULT_NOTES[0].title),
    ).resolves.toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    await waitFor(() => {
      expect(mockAxios.delete).toHaveBeenCalledWith(
        getNotesPath(DEFAULT_NOTES[0].id),
      );
    });
  });
});
