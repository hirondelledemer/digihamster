import { Tag } from "@/models/tag";

// TODO :check why typescript does not work?
export const generateTag: (i?: number, properties?: Partial<Tag>) => Tag = (
  i = 1,
  properties
) => {
  const tag: Tag = {
    _id: `tag${i}`,
    title: `Tag ${i}`,
    color: `tag-color-${i}`,
    deleted: false,

    ...properties,
  };
  return tag;
};

export const generateListOfTags: (count: number) => Tag[] = (count) => {
  return [...Array(count)].map((_v, i) => generateTag(i));
};

export const generateCustomTagsList: (taskInfo: Partial<Tag>[]) => Tag[] = (
  projectInfo
) => {
  return projectInfo.map((projectProperties, i) => ({
    ...generateTag(i, projectProperties),
  }));
};
