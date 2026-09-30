import {
  generateListOfLocations,
  generateLocation,
} from "../../mocks/location";
import {
  CreateLocationAction,
  DeleteLocationAction,
  LocationsErrorAction,
  LocationsFinishLoadingAction,
  LocationsLoadAction,
  LocationsStateActionType,
  UpdateLocationAction,
} from "./actions";
import { reducer } from "./reducer";

describe("LocationsContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: LocationsLoadAction = {
      type: LocationsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfLocations(3);
    const action: LocationsFinishLoadingAction = {
      type: LocationsStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch locations";
    const action: LocationsErrorAction = {
      type: LocationsStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_LOCATION action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const location = generateLocation();

    const action: CreateLocationAction = {
      type: LocationsStateActionType.CreateLocation,
      payload: { location },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [location],
    });
  });

  it("should handle UPDATE_LOCATION action", () => {
    const tempId = -1;
    const location = generateLocation(0, { id: tempId });
    const initialState = {
      isLoading: true,
      data: [location],
      errorMessage: undefined,
    };

    const editedData = { title: "edited location" };
    const editedLocation = { ...location, title: "edited location" };

    const action: UpdateLocationAction = {
      type: LocationsStateActionType.UpdateLocation,
      payload: { location: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedLocation],
    });
  });

  it("should handle DELETE_LOCATION action", () => {
    const locations = generateListOfLocations(2);
    const initialState = {
      isLoading: true,
      data: locations,
      errorMessage: undefined,
    };

    const idToDelete = locations[0].id;

    const action: DeleteLocationAction = {
      type: LocationsStateActionType.DeleteLocation,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [locations[1]],
    });
  });
});
