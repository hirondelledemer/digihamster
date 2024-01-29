/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTags
// ====================================================

export interface GetTags_tags {
  __typename: "Tag";
  id: string;
  title: string;
  color: string;
}

export interface GetTags {
  tags: GetTags_tags[];
}
