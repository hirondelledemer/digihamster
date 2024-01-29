/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTag
// ====================================================

export interface CreateTag_createTag {
  __typename: "Tag";
  id: string;
  title: string;
  color: string;
}

export interface CreateTag {
  createTag: CreateTag_createTag | null;
}

export interface CreateTagVariables {
  title: string;
  color: string;
}
