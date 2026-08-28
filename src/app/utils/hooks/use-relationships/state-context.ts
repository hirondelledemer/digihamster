import { createContext, useContext } from "react";
import { RelationshipsState } from "./actions";

type RelationshipsContextValue = RelationshipsState;

const DEFAULT_RELATIONSHIPS_STATE: RelationshipsState = {
  data: [],
  isLoading: false,
  errorMessage: undefined,
} as const;

export const RelationshipsStateContext =
  createContext<RelationshipsContextValue>(DEFAULT_RELATIONSHIPS_STATE);

export const useRelationshipsState = () =>
  useContext(RelationshipsStateContext);
