import { generateListOfTags, generateTag } from "../../mocks/tag";
import {
  CreateTagAction,
  DeleteTagAction,
  TagsErrorAction,
  TagsFinishLoadingAction,
  TagsLoadAction,
  TagsStateActionType,
  UpdateTagAction,
} from "./actions";
import { reducer } from "./reducer";

describe("TagsContext reducer", () => {
  it("should handle START_LOADING action", () => {
    const initialState = {
      isLoading: false,
      data: [],
      errorMessage: undefined,
    };
    const action: TagsLoadAction = {
      type: TagsStateActionType.StartLoading,
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [],
    });
  });

  it("should handle FINISH_LOADING action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const mockData = generateListOfTags(3);
    const action: TagsFinishLoadingAction = {
      type: TagsStateActionType.FinishLoading,
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
    const errorMessage = "Failed to fetch tags";
    const action: TagsErrorAction = {
      type: TagsStateActionType.Error,
      payload: { errorMessage },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [],
      errorMessage,
    });
  });

  it("should handle CREATE_TAG action", () => {
    const initialState = { isLoading: true, data: [], errorMessage: undefined };
    const tag = generateTag();

    const action: CreateTagAction = {
      type: TagsStateActionType.CreateTag,
      payload: { tag },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: true,
      data: [tag],
    });
  });

  it("should handle UPDATE_TAG action", () => {
    const tempId = "new-id";
    const tag = generateTag(0, { _id: tempId });
    const initialState = {
      isLoading: true,
      data: [tag],
      errorMessage: undefined,
    };

    const editedData = { title: "edited tag" };
    const editedTag = { ...tag, title: "edited tag" };

    const action: UpdateTagAction = {
      type: TagsStateActionType.UpdateTag,
      payload: { tag: editedData, id: tempId },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [editedTag],
    });
  });

  it("should handle DELETE_TAG action", () => {
    const tags = generateListOfTags(2);
    const initialState = {
      isLoading: true,
      data: tags,
      errorMessage: undefined,
    };

    const idToDelete = tags[0]._id;

    const action: DeleteTagAction = {
      type: TagsStateActionType.DeleteTag,
      payload: { id: idToDelete },
    };
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual({
      isLoading: false,
      data: [tags[1]],
    });
  });
});
