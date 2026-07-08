import { createContext, useContext } from "react";
import { TagsState } from "./actions";

type TagsContextValue = TagsState;

const DEFAULT_TAGS_STATE: TagsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const TagsStateContext =
  createContext<TagsContextValue>(DEFAULT_TAGS_STATE);

export const useTagsState = () => useContext(TagsStateContext);
