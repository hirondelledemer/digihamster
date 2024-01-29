// import {
//   MUTATION_CREATE_TAG,
//   QUERY_GET_TAGS,
// } from './MentionList.queries';
import { CreateTag, CreateTagVariables } from "./__generated__/CreateTag";
import { GetTags } from "./__generated__/GetTags";

export const buildCreateTagMutationMock = ({
  variables,
  callback,
}: {
  variables: CreateTagVariables;
  callback(): void;
}) => {
  const tagData: CreateTag = {
    createTag: {
      __typename: "Tag",
      id: "newTag1",
      title: variables.title,
      color: variables.color,
    },
  };
  return {
    request: {
      query: "MUTATION_CREATE_TAG",
      variables,
    },
    result: () => {
      callback();
      return {
        data: tagData,
      };
    },
  };
};

export const data: GetTags = {
  tags: [
    {
      __typename: "Tag",
      id: "tag1",
      title: "Tag 1",
      color: "tagColor1",
    },
    {
      __typename: "Tag",
      id: "tag2",
      title: "Tag 2",
      color: "tagColor2",
    },
    {
      __typename: "Tag",
      id: "tag3",
      title: "Tag 3",
      color: "tagColor3",
    },
  ],
};
export const buildGetTagsMutationMock = () => {
  return {
    request: {
      query: "QUERY_GET_TAGS",
    },
    result: () => {
      return {
        data,
      };
    },
  };
};
