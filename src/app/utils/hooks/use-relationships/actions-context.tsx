import { createContext, useContext } from "react";
import { CreateRelationshipParams } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { IRelationship } from "../../types/relationship";

type RelationshipActionsContextValue = ActionsContextValue<
  CreateRelationshipParams,
  IRelationship
>;

const DEFAULT_RELATIONSHIPS_ACTIONS: RelationshipActionsContextValue = {
  // nothing was created without a provider, so there is nothing to hand back
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const RelationshipsActionsContext =
  createContext<RelationshipActionsContextValue>(DEFAULT_RELATIONSHIPS_ACTIONS);

export const useRelationshipsActions = () =>
  useContext(RelationshipsActionsContext);
