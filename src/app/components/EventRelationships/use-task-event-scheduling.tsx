import { TaskAction } from "@/app/components/TaskActions";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { useRelationshipBetweenEntities } from "@/app/utils/hooks/use-relationships/selectors";
import { relationshipTypeFor } from "@/app/utils/relationships/relationship-types";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useNavigator } from "./navigator-context";

export interface TaskEventScheduling {
  /** the task already hangs off the event the panel was opened on */
  scheduled: boolean;
  /** extra card actions, empty when there is nothing worth offering */
  actions: TaskAction[];
}

export const useTaskEventScheduling = (
  taskId: number | undefined
): TaskEventScheduling => {
  const { entities } = useNavigator();
  const { create } = useRelationshipsActions();

  const root = entities[0];
  const event = root?.type === RelationshipEntityType.Event ? root : undefined;

  const existing = useRelationshipBetweenEntities(
    event ? { id: event.id, type: RelationshipEntityType.Event } : null,
    taskId === undefined
      ? null
      : { id: taskId, type: RelationshipEntityType.Task }
  );

  const scheduled = !!existing;

  if (!event || scheduled || taskId === undefined) {
    return { scheduled, actions: [] };
  }

  return {
    scheduled,
    actions: [
      {
        label: "Move to the event",
        icon: <IconCalendarPlus />,
        onClick: () =>
          create({
            source_id: event.id,
            source_type: RelationshipEntityType.Event,
            target_id: taskId,
            target_type: RelationshipEntityType.Task,
            relationship_type: relationshipTypeFor(
              RelationshipEntityType.Event,
              RelationshipEntityType.Task
            ),
          }),
      },
    ],
  };
};
