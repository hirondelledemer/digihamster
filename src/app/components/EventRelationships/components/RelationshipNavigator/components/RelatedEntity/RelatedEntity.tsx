import {
  IRelationship,
  RelationshipEntityType,
} from "@/app/utils/types/relationship";
import { FC } from "react";
import { RelatedTask } from "../RelatedTask";
import { RelatedEvent } from "../RelatedEvent";
import { RelatedHabit } from "../RelatedHabit";
import { RelatedJournal } from "../RelatedJournal";
import { RelatedLocation } from "../RelatedLocation";
import { RelatedNote } from "../RelatedNote";
import { RelatedPerson } from "../RelatedPerson";
import { RelatedProject } from "../RelatedProject/RelatedProject";
import { RelatedEntityActions } from "../RelatedEntityActions";

export interface RelatedEntityProps {
  relationship: IRelationship;
  compact: boolean;
}

export const RelatedEntity: FC<RelatedEntityProps> = ({
  relationship,
  compact,
}) => {
  const getComponent = () => {
    const props = { id: relationship.target_id, compact };

    switch (relationship.target_type) {
      case RelationshipEntityType.Task:
        return <RelatedTask {...props} />;
      case RelationshipEntityType.Event:
        return <RelatedEvent {...props} />;
      case RelationshipEntityType.Habit:
        return <RelatedHabit {...props} />;
      case RelationshipEntityType.Journal:
        return <RelatedJournal {...props} />; // TODO: maybe extract these props
      case RelationshipEntityType.Location:
        return <RelatedLocation {...props} />;
      case RelationshipEntityType.Note:
        return <RelatedNote {...props} />;
      case RelationshipEntityType.Person:
        return <RelatedPerson {...props} />;
      case RelationshipEntityType.Project:
        return <RelatedProject {...props} />;
      default:
        return <div>error</div>;
    }
  };

  if (compact || relationship.target_type === RelationshipEntityType.Note) {
    return getComponent();
  }

  return (
    <RelatedEntityActions
      entityId={relationship.target_id}
      entityType={relationship.target_type}
      relationshipId={relationship.id}
    >
      {getComponent()}
    </RelatedEntityActions>
  );
};
