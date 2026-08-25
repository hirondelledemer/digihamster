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
      errorMessage: undefined,
    });
  });

  it("should keep the events it already has while reloading", () => {
    const data = generateListOfEvents(3);
    const initialState = { isLoading: false, data, errorMessage: undefined };
    const action: EventsLoadAction = {
      type: EventsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState.data).toEqual(data);
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

    // the event is added optimistically, so the state is not loading anything
    expect(newState).toStrictEqual({
      isLoading: false,
      data: [event],
    });
  });

  it("should handle UPDATE_EVENT action", () => {
    const tempId = -1;
    const event = generateEvent(0, { id: tempId });
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

    const idToDelete = events[0].id;

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
