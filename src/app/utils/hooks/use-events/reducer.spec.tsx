import { generateEvent, generateListOfEvents } from "../../mocks/event";
import {
  CreateEventAction,
  DeleteEventAction,
  EventsErrorAction,
  EventsFinishLoadingAction,
  EventsLoadAction,
  EventsStateActionType,
  UpdateEventAction,
} from "./actions";
import { reducer } from "./reducer";

describe("EventsContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: EventsLoadAction = {
      type: EventsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfEvents(3);
    const action: EventsFinishLoadingAction = {
      type: EventsStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch events";
    const action: EventsErrorAction = {
      type: EventsStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_EVENT action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const event = generateEvent();

    const action: CreateEventAction = {
      type: EventsStateActionType.CreateEvent,
      payload: { event },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [event],
    });
  });

  it("should handle UPDATE_EVENT action", () => {
    const tempId = "new-id";
    const event = generateEvent(0, { _id: tempId });
    const initialState = {
      isLoading: true,
      data: [event],
      errorMessage: undefined,
    };

    const editedData = { title: "edited event" };
    const editedEvent = { ...event, title: "edited event" };

    const action: UpdateEventAction = {
      type: EventsStateActionType.UpdateEvent,
      payload: { event: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedEvent],
    });
  });

  it("should handle DELETE_EVENT action", () => {
    const events = generateListOfEvents(2);
    const initialState = {
      isLoading: true,
      data: events,
      errorMessage: undefined,
    };

    const idToDelete = events[0]._id;

    const action: DeleteEventAction = {
      type: EventsStateActionType.DeleteEvent,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [events[1]],
    });
  });
});
