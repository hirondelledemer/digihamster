import { ILocation } from "../types/location";

export const generateLocation: (
  i?: number,
  properties?: Partial<ILocation>
) => ILocation = (i = 1, properties) => {
  return {
    id: i,
    title: `Location ${i}`,
    color: `location-color-${i}`,
    ...properties,
  };
};

export const generateListOfLocations: (count: number) => ILocation[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateLocation(i));
};

export const generateCustomLocationsList: (
  locationInfo: Partial<ILocation>[]
) => ILocation[] = (personInfo) => {
  return personInfo.map((personProperties, i) => ({
    ...generateLocation(i, personProperties),
  }));
};
