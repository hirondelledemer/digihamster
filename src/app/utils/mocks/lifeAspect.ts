import { LifeAspect } from "@/models/life-aspect";

export const generateLifeAspect: (
  i?: number,
  properties?: Partial<LifeAspect>
) => LifeAspect = (i = 1, properties) => {
  return {
    _id: `lifeAspect${i}`,
    title: `Life Aspect ${i}`,
    deleted: false,
    boosts: [],
    updatedAt: "",
    asset: "tree",
    ...properties,
  };
};

export const generateListOfLifeAspects: (count: number) => LifeAspect[] = (
  count
) => {
  return [...Array(count)].map((_v, i) => generateLifeAspect(i));
};

export const generateCustomLifeAspectList: (
  habitInfo: Partial<LifeAspect>[]
) => LifeAspect[] = (taskInfo) => {
  return taskInfo.map((taskProperties, i) => ({
    ...generateLifeAspect(i, taskProperties),
  }));
};
