import { createContext, useContext } from "react";
import { CreatePersonParams } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { IPerson } from "../../types/person";

type PersonActionsContextValue = ActionsContextValue<
  CreatePersonParams,
  IPerson
>;

const DEFAULT_PEOPLE_ACTIONS: PersonActionsContextValue = {
  // nothing was created without a provider, so there is nothing to hand back
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const PeopleActionsContext = createContext<PersonActionsContextValue>(
  DEFAULT_PEOPLE_ACTIONS,
);

export const usePeopleActions = () => useContext(PeopleActionsContext);
