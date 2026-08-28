import {
  generateListOfRelationships,
  generateRelationship,
} from "../../mocks/relationship";
import {
  CreateRelationshipAction,
  DeleteRelationshipAction,
  RelationshipsErrorAction,
  RelationshipsFinishLoadingAction,
  RelationshipsLoadAction,
  RelationshipsStateActionType,
  UpdateRelationshipAction,
} from "./actions";
import { reducer } from "./reducer";

describe("RelationshipsContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: RelationshipsLoadAction = {
      type: RelationshipsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfRelationships(3);
    const action: RelationshipsFinishLoadingAction = {
      type: RelationshipsStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch relationships";
    const action: RelationshipsErrorAction = {
      type: RelationshipsStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_RELATIONSHIP action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const relationship = generateRelationship();

    const action: CreateRelationshipAction = {
      type: RelationshipsStateActionType.CreateRelationship,
      payload: { relationship },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [relationship],
    });
  });

  it("should handle UPDATE_RELATIONSHIP action", () => {
    const tempId = -1;
    const relationship = generateRelationship(0, { id: tempId });
    const initialState = {
      isLoading: true,
      data: [relationship],
      errorMessage: undefined,
    };

    const editedData = { id: 5 };
    const editedRelationship = { ...relationship, id: 5 };

    const action: UpdateRelationshipAction = {
      type: RelationshipsStateActionType.UpdateRelationship,
      payload: { relationship: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedRelationship],
    });
  });

  it("should handle DELETE_RELATIONSHIP action", () => {
    const relationships = generateListOfRelationships(2);
    const initialState = {
      isLoading: true,
      data: relationships,
      errorMessage: undefined,
    };

    const idToDelete = relationships[0].id;

    const action: DeleteRelationshipAction = {
      type: RelationshipsStateActionType.DeleteRelationship,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [relationships[1]],
    });
  });
});
