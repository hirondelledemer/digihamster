import { format } from "date-fns";
import { useEventsActions } from "../hooks/use-events/actions-context";
import { useNotesActions } from "../hooks/use-notes/actions-context";
import { useRelationshipsActions } from "../hooks/use-relationships/actions-context";
import { useRelevantRelationshipsForEntity } from "../hooks/use-relationships/selectors";
import { useTasksActions } from "../hooks/use-tasks/actions-context";
import { EventStatus, IEvent } from "../types/event";
import { RelationshipEntityType } from "../types/relationship";
import { TaskStatus } from "../types/task";

export const useCompleteEvent = (event: IEvent) => {
  const { update: updateEvent } = useEventsActions();
  const { updateTask } = useTasksActions();
  const { create: createRelationship } = useRelationshipsActions();
  const { create: createNote } = useNotesActions();

  const relationships = useRelevantRelationshipsForEntity({
    entityId: event.id,
    entityType: RelationshipEntityType.Event,
  });

  const relatedTasksEdges = relationships.filter(
    (r) => r.target_type === RelationshipEntityType.Task
  );

  const handleEventCompletion = async () => {
    await updateEvent(event.id, { status: EventStatus.Completed });

    relatedTasksEdges.forEach(async (r) => {
      updateTask(r.target_id, { status: TaskStatus.Doing });

      const note = await createNote({
        title: "",
        content: ``,
        json_content: {
          content: [
            {
              content: [
                {
                  text: `activated after "${event.title}" (on ${format(
                    event.start_at,
                    "MMM d"
                  )}) was completed`,
                  type: "text",
                },
              ],
              type: "paragraph",
            },
          ],
          type: "doc",
        },
      });

      if (!!note) {
        createRelationship({
          source_id: r.target_id,
          source_type: r.target_type,
          target_id: note.id,
          target_type: RelationshipEntityType.Note,
        });
      }
    });
  };

  return handleEventCompletion;
};
