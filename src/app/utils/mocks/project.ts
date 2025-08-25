import { Project } from "@/models/project";
import { COLORS_V2 } from "../consts/colors";

export const generateProject: (
  i?: number,
  properties?: Partial<Project>
) => Project = (i = 1, properties) => {
  return {
    _id: `project${i}`,
    title: `Project ${i}`,
    color: COLORS_V2[i],
    order: 0,
    deleted: false,
    createdAt: 0,
    updatedAt: 0,
    disabled: false,
    jsonDescription: null,
    category: "home",
    ...properties,
  };
};

export const generateListOfProjects: (count: number) => Project[] = (count) => {
  return [...Array(count)].map((_v, i) => generateProject(i));
};

export const generateCustomProjectsList: (
  taskInfo: Partial<Project>[]
) => Project[] = (projectInfo) => {
  return projectInfo.map((projectProperties, i) => ({
    ...generateProject(i, projectProperties),
  }));
};
