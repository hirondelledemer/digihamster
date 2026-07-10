import { createContext, useContext } from "react";
import { CreateTagParams } from "./api";
import { Tag } from "@/models/tag";
import { ActionsContextValue } from "../use-crud/actions-context";

type TagActionsContextValue = ActionsContextValue<CreateTagParams, Tag>;

const DEFAULT_TAGS_ACTIONS: TagActionsContextValue = {
  create: () => {},
  update: () => {},
  delete: () => {},
} as const;

export const TagsActionsContext = createContext<TagActionsContextValue>(
  DEFAULT_TAGS_ACTIONS
);

export const useTagsActions = () => useContext(TagsActionsContext);
