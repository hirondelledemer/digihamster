import { IPerson } from "../types/person";

export const generatePerson: (
  i?: number,
  properties?: Partial<IPerson>
) => IPerson = (i = 1, properties) => {
  return {
    id: i,
    name: `Person ${i}`,
    color: `person-color-${i}`,
    deleted: false,

    ...properties,
  };
};

export const generateListOfPeople: (count: number) => IPerson[] = (count) => {
  return [...Array(count)].map((_v, i) => generatePerson(i));
};

export const generateCustomPeopleList: (
  personInfo: Partial<IPerson>[]
) => IPerson[] = (personInfo) => {
  return personInfo.map((personProperties, i) => ({
    ...generatePerson(i, personProperties),
  }));
};
