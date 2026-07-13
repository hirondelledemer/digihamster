import { COLORS_V2 } from "../consts/colors";
import { IProject, ProjectStatus } from "../types/project";

const DEFAULT_TEST_DATE = "1970-01-11T10:10:10Z";

export const generateProject: (
  i?: number,
  properties?: Partial<IProject>,
) => IProject = (i = 1, properties) => {
  return {
    id: i,
    title: `Project ${i}`,
    description: `Project description ${i}`,
    color: COLORS_V2[i],
    sort_order: 0,
    created_at: DEFAULT_TEST_DATE,
    life_aspect_id: i,
    status: ProjectStatus.Todo,
    ...properties,
  };
};

export const generateListOfProjects: (count: number) => IProject[] = (
  count,
) => {
  return [...Array(count)].map((_v, i) => generateProject(i));
};

export const generateCustomProjectsList: (
  taskInfo: Partial<IProject>[],
) => IProject[] = (projectInfo) => {
  return projectInfo.map((projectProperties, i) => ({
    ...generateProject(i, projectProperties),
  }));
};
