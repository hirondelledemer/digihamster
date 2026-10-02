import { createContext, useContext } from "react";
import { CreateLocationParams } from "./api";
import {
  ActionsContextValue,
  GENERIC_ACTIONS,
} from "../use-crud/actions-context";
import { ILocation } from "../../types/location";

type LocationActionsContextValue = ActionsContextValue<
  CreateLocationParams,
  ILocation
>;

const DEFAULT_LOCATIONS_ACTIONS = {
  ...GENERIC_ACTIONS,
} as const satisfies LocationActionsContextValue;

export const LocationsActionsContext =
  createContext<LocationActionsContextValue>(DEFAULT_LOCATIONS_ACTIONS);

export const useLocationsActions = () => useContext(LocationsActionsContext);
