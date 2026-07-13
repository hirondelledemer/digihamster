import { ILifeAspect } from "../types/life-aspect";

export const generateLifeAspect: (
  i?: number,
  properties?: Partial<ILifeAspect>,
) => ILifeAspect = (i = 1, properties) => {
  return {
    id: i,
    title: `Life Aspect ${i}`,
    description: `Life Aspect Description ${i}`,
    boosts: [],
    updatedAt: "",
    asset: "tree",
    ...properties,
  };
};

export const generateListOfLifeAspects: (count: number) => ILifeAspect[] = (
  count,
) => {
  return [...Array(count)].map((_v, i) => generateLifeAspect(i));
};

export const generateCustomLifeAspectList: (
  habitInfo: Partial<ILifeAspect>[],
) => ILifeAspect[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateLifeAspect(i, taskProperties),
  }));
};
