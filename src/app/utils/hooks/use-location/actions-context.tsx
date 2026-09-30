import { createContext, useContext } from "react";
import { CreateLocationParams } from "./api";
import { ActionsContextValue } from "../use-crud/actions-context";
import { ILocation } from "../../types/location";

type LocationActionsContextValue = ActionsContextValue<
  CreateLocationParams,
  ILocation
>;

const DEFAULT_LOCATIONS_ACTIONS: LocationActionsContextValue = {
  create: async () => null,
  update: () => {},
  delete: () => {},
} as const;

export const LocationsActionsContext =
  createContext<LocationActionsContextValue>(DEFAULT_LOCATIONS_ACTIONS);

export const useLocationsActions = () => useContext(LocationsActionsContext);
