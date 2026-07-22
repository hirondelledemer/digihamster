import {
  generateJournalEntry,
  generateListOfJournalEntries,
} from "../../mocks/journal-entry";
import {
  CreateEntryAction,
  DeleteEntryAction,
  EntriesErrorAction,
  EntriesFinishLoadingAction,
  EntriesLoadAction,
  EntriesStateActionType,
  UpdateEntryAction,
} from "./actions";
import { reducer } from "./reducer";

describe("EntriesContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: EntriesLoadAction = {
      type: EntriesStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfJournalEntries(3);
    const action: EntriesFinishLoadingAction = {
      type: EntriesStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch entries";
    const action: EntriesErrorAction = {
      type: EntriesStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_ENTRY action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const entry = generateJournalEntry();

    const action: CreateEntryAction = {
      type: EntriesStateActionType.CreateEntry,
      payload: { entry },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [entry],
    });
  });

  it("should handle UPDATE_ENTRY action", () => {
    const tempId = -1;
    const entry = generateJournalEntry(0, { id: tempId });
    const initialState = {
      isLoading: true,
      data: [entry],
      errorMessage: undefined,
    };

    const editedData = { title: "edited entry" };
    const editedEntry = { ...entry, title: "edited entry" };

    const action: UpdateEntryAction = {
      type: EntriesStateActionType.UpdateEntry,
      payload: { entry: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedEntry],
    });
  });

  it("should handle DELETE_ENTRY action", () => {
    const entries = generateListOfJournalEntries(2);
    const initialState = {
      isLoading: true,
      data: entries,
      errorMessage: undefined,
    };

    const idToDelete = entries[0].id;

    const action: DeleteEntryAction = {
      type: EntriesStateActionType.DeleteEntry,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [entries[1]],
    });
  });
});
