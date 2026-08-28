import { IRelationship, RelationshipEntityType } from "../types/relationship";

export const generateRelationship: (
  i?: number,
  properties?: Partial<IRelationship>,
) => IRelationship = (i = 1, properties) => {
  return {
    id: i,
    source_type: RelationshipEntityType.Event,
    source_id: i,
    target_type: RelationshipEntityType.Journal,
    target_id: i,
    relationship_type: "related",
    ...properties,
  };
};

export const generateListOfRelationships: (count: number) => IRelationship[] = (
  count,
) => {
  return [...Array(count)].map((_v, i) => generateRelationship(i));
};

export const generateCustomRelationshipsList: (
  relationshipInfo: Partial<IRelationship>[],
) => IRelationship[] = (relationshipInfo) => {
  return relationshipInfo.map((relationshipProperties, i) => ({
    ...generateRelationship(i, relationshipProperties),
  }));
};
