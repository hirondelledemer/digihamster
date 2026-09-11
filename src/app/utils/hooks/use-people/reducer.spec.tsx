import { generateListOfPeople, generatePerson } from "../../mocks/person";
import {
  CreatePersonAction,
  DeletePersonAction,
  PeopleErrorAction,
  PeopleFinishLoadingAction,
  PeopleLoadAction,
  PeopleStateActionType,
  UpdatePersonAction,
} from "./actions";
import { reducer } from "./reducer";

describe("PeopleContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: PeopleLoadAction = {
      type: PeopleStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfPeople(3);
    const action: PeopleFinishLoadingAction = {
      type: PeopleStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch people";
    const action: PeopleErrorAction = {
      type: PeopleStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_PERSON action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const person = generatePerson();

    const action: CreatePersonAction = {
      type: PeopleStateActionType.CreatePerson,
      payload: { person },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [person],
    });
  });

  it("should handle UPDATE_PERSON action", () => {
    const tempId = -1;
    const person = generatePerson(0, { id: tempId });
    const initialState = {
      isLoading: true,
      data: [person],
      errorMessage: undefined,
    };

    const editedData = { title: "edited person" };
    const editedPerson = { ...person, title: "edited person" };

    const action: UpdatePersonAction = {
      type: PeopleStateActionType.UpdatePerson,
      payload: { person: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedPerson],
    });
  });

  it("should handle DELETE_PERSON action", () => {
    const people = generateListOfPeople(2);
    const initialState = {
      isLoading: true,
      data: people,
      errorMessage: undefined,
    };

    const idToDelete = people[0].id;

    const action: DeletePersonAction = {
      type: PeopleStateActionType.DeletePerson,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [people[1]],
    });
  });
});
