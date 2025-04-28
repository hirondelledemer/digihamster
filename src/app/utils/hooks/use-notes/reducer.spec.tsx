import { generateListOfNotes, generateNote } from "../../mocks/note";
import {
  CreateNoteAction,
  DeleteNoteAction,
  NotesErrorAction,
  NotesFinishLoadingAction,
  NotesLoadAction,
  NotesStateActionType,
  UpdateNoteAction,
} from "./actions";
import { reducer } from "./reducer";

describe("NotesContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: NotesLoadAction = {
      type: NotesStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfNotes(3);
    const action: NotesFinishLoadingAction = {
      type: NotesStateActionType.FinishLoading,
      payload: { data: mockData },
    };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      isLoading: false,
      data: mockData,
    });
  });

  it("should handle ERROR action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const errorMessage = "Failed to fetch notes";
    const action: NotesErrorAction = {
      type: NotesStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_NOTE action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const note = generateNote();

    const action: CreateNoteAction = {
      type: NotesStateActionType.CreateNote,
      payload: { note },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [note],
    });
  });

  it("should handle UPDATE_NOTE action", () => {
    const tempId = "new-id";
    const note = generateNote(0, { _id: tempId });
    const initialState = {
      isLoading: true,
      data: [note],
      errorMessage: undefined,
    };

    const editedData = { title: "edited note" };
    const editedNote = { ...note, title: "edited note" };

    const action: UpdateNoteAction = {
      type: NotesStateActionType.UpdateNote,
      payload: { note: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedNote],
    });
  });

  it("should handle DELETE_NOTE action", () => {
    const notes = generateListOfNotes(2);
    const initialState = {
      isLoading: true,
      data: notes,
      errorMessage: undefined,
    };

    const idToDelete = notes[0]._id;

    const action: DeleteNoteAction = {
      type: NotesStateActionType.DeleteNote,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [notes[1]],
    });
  });
});
