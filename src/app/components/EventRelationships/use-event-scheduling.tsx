import { AdditionalAction } from "@/app/components/AdditionalActions";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { useRelationshipBetweenEntities } from "@/app/utils/hooks/use-relationships/selectors";
import { EntityRef } from "@/app/utils/relationships/edges";
import { relationshipTypeFor } from "@/app/utils/relationships/relationship-types";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useNavigator } from "./navigator-context";

export interface EventScheduling {
  /** the event the panel was opened on, when it was opened on one */
  eventId: number | null;
  /** the entity already hangs off that event */
  scheduled: boolean;
  /**
   * Whether that is worth telling you, which is not the same question.
   *
   * A card drawn in the event's own list is in the event by definition - that
   * is what the list is - so the marker there restates the position it is
   * sitting in. One step out, on what a location or a project suggests, the
   * same fact is news: it is how you tell the ones you have already pulled in
   * from the ones you have not.
   */
  showScheduled: boolean;
  /** extra card actions, empty when there is nothing worth offering */
  actions: AdditionalAction[];
}

/**
 * You open an event, follow it out to a location, and the location suggests
 * what you do when you are there - the tasks, the habits you keep. Those are
 * candidates for the event you came from: things you could get done while you
 * are already at the place.
 *
 * Both halves of that, the offer to add one and the marker saying you have,
 * are facts about where the panel was opened rather than about the thing
 * itself, so they are worked out here instead of being handed down through
 * every entity that can hold one. Any card rendered inside the navigator can
 * ask; outside one there is no event to move anything to, and nothing is
 * offered.
 */
export const useEventScheduling = (
  type: RelationshipEntityType,
  id: number | undefined,
  /**
   * What the card hangs off, when it was drawn from the tree. Only the marker
   * reads it; leaving it out means "not the event's own list", which is the
   * right answer for a card the tree did not place.
   */
  parent?: EntityRef | null
): EventScheduling => {
  const { entities } = useNavigator();
  const { create } = useRelationshipsActions();

  // The event the panel was opened on, and only that one. The whole trail
  // hangs off it - you went to the location *because* of this event - so
  // wherever you have wandered to since, "the event" still means this one.
  //
  // Depth is no guide to any of this: a location expands its suggestions
  // inside its own card, so one sits in the same column as the event's own
  // list. Whether the entity is already in the event is the only thing that
  // decides between offering the move and marking it done, and the
  // relationship below answers that wherever the card was drawn.
  const root = entities[0];
  const event = root?.type === RelationshipEntityType.Event ? root : undefined;

  const existing = useRelationshipBetweenEntities(
    event ? { id: event.id, type: RelationshipEntityType.Event } : null,
    id === undefined ? null : { id, type }
  );

  const scheduled = !!existing;
  const eventId = event?.id ?? null;

  // the event's own list, as opposed to anywhere else the event's panel got
  // to - which is the whole of the distinction the marker draws
  const inEventsOwnList =
    !!event &&
    parent?.type === RelationshipEntityType.Event &&
    parent.id === event.id;

  if (!event || scheduled || id === undefined) {
    return {
      eventId,
      scheduled,
      showScheduled: scheduled && !inEventsOwnList,
      actions: [],
    };
  }

  return {
    eventId,
    scheduled,
    showScheduled: false,
    actions: [
      {
        label: "Move to the event",
        icon: <IconCalendarPlus />,
        onClick: () =>
          create({
            source_id: event.id,
            source_type: RelationshipEntityType.Event,
            target_id: id,
            target_type: type,
            // a habit joined to an event is an occurrence of it rather than a
            // plain association, and this already knows that
            relationship_type: relationshipTypeFor(
              RelationshipEntityType.Event,
              type
            ),
          }),
      },
    ],
  };
};
