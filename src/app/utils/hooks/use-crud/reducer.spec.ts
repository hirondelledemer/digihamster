import { CrudAction, CrudActionType, CrudState } from "./actions";
import { crudReducer } from "./reducer";

interface TestEntity {
  id: number;
  title: string;
}

const generateEntity = (i: number): TestEntity => ({
  id: i,
  title: `Entity ${i}`,
});

const generateListOfEntities = (count: number): TestEntity[] =>
  [...Array(count)].map((_v, i) => generateEntity(i));

const reducer = (
  state: CrudState<TestEntity>,
  action: CrudAction<TestEntity>
) => crudReducer<TestEntity>(state, action);

describe("crudReducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };

    const newState = reducer(initialState, {
      type: CrudActionType.StartLoading,
    });

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfEntities(3);

    const newState = reducer(initialState, {
      type: CrudActionType.FinishLoading,
      payload: { data: mockData },
    });

    expect(newState).toEqual({
      isLoading: false,
      data: mockData,
    });
  });

  it("should handle ERROR action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const errorMessage = "Failed to fetch";

    const newState = reducer(initialState, {
      type: CrudActionType.Error,
      payload: { errorMessage },
    });

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const entity = generateEntity(1);

    const newState = reducer(initialState, {
      type: CrudActionType.Create,
      payload: { entity },
    });

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [entity],
    });
  });

  it("should handle UPDATE action", () => {
    const tempId = -1;
    const entity = { ...generateEntity(0), id: tempId };
    const initialState = {
      isLoading: true,
      data: [entity],
      errorMessage: undefined,
    };

    const editedData = { title: "edited entity" };

    const newState = reducer(initialState, {
      type: CrudActionType.Update,
      payload: { entity: editedData, id: tempId },
    });

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [{ ...entity, ...editedData }],
    });
  });

  it("should handle DELETE action", () => {
    const entities = generateListOfEntities(2);
    const initialState = {
      isLoading: true,
      data: entities,
      errorMessage: undefined,
    };

    const newState = reducer(initialState, {
      type: CrudActionType.Delete,
      payload: { id: entities[0].id },
    });

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [entities[1]],
    });
  });

  it("should throw on an unknown action", () => {
    const initialState = { isLoading: false, data: [] };

    expect(() =>
      reducer(initialState, { type: "NOT_A_CRUD_ACTION" } as never)
    ).toThrow("Unknown action");
  });
});
