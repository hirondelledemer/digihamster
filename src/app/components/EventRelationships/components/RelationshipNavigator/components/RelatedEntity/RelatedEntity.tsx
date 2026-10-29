import { RelationshipNode } from "@/app/utils/hooks/use-relationships/use-relationship-tree";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
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
  /**
   * The neighbour and whatever the walk decided belongs under it. Nothing
   * here looks anything up - if a node has no children it is because the
   * tree said so, which is what keeps this from walking the graph by
   * rendering.
   */
  node: RelationshipNode;
  compact: boolean;
}

export const RelatedEntity: FC<RelatedEntityProps> = ({ node, compact }) => {
  const { entity, children, edge, summary } = node;

  const getComponent = () => {
    const props = { id: entity.id, compact, summary };

    switch (entity.type) {
      case RelationshipEntityType.Task:
        return <RelatedTask {...props} related={children} />;
      case RelationshipEntityType.Event:
        return <RelatedEvent {...props} />;
      case RelationshipEntityType.Habit:
        return <RelatedHabit {...props} />;
      case RelationshipEntityType.Journal:
        return <RelatedJournal {...props} />; // TODO: maybe extract these props
      case RelationshipEntityType.Location:
        return <RelatedLocation {...props} related={children} />;
      case RelationshipEntityType.Note:
        return <RelatedNote {...props} />;
      case RelationshipEntityType.Person:
        return <RelatedPerson {...props} />;
      case RelationshipEntityType.Project:
        return <RelatedProject {...props} related={children} />;
      default:
        return <div>error</div>;
    }
  };

  // only the root has no edge, and the root is never rendered through here
  if (compact || entity.type === RelationshipEntityType.Note || !edge) {
    return getComponent();
  }

  return (
    <RelatedEntityActions
      entityId={entity.id}
      entityType={entity.type}
      relationshipId={edge.id}
    >
      {getComponent()}
    </RelatedEntityActions>
  );
};
