import React, { ReactNode, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import TaskFormModal from "../TaskFormModal";
import { useTasksActions } from "@/app/utils/hooks/use-tasks/actions-context";
import { AdditionalAction, AdditionalActions } from "../AdditionalActions";
import {
  IconBackspace,
  IconCalendarCancel,
  IconCalendarPlus,
  IconCheck,
  IconEdit,
  IconProgressCheck,
  IconProgressDown,
  IconTrash,
} from "@tabler/icons-react";
import { useSelectedEvent } from "../ActiveContext/use-selected-event";
import { useRelationshipsActions } from "@/app/utils/hooks/use-relationships/actions-context";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { RelationshipType } from "@/app/utils/relationships/relationship-types";

interface TaskActionProps {
  children: ReactNode;
  task: ITask;
  additionalActions?: AdditionalAction[];
}

export const TaskActions: React.FC<TaskActionProps> = ({
  children,
  task,
  additionalActions,
}) => {
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { updateTask: editTask, deleteTask } = useTasksActions();

  const closeTaskForm = () => setTaskFormOpen(false);
  const selectedEvent = useSelectedEvent(); // TODO: move this hook to the utils or smht. maybe to the utils/events
  const { create: createRelationship } = useRelationshipsActions();

  return (
    <>
      <TaskFormModal
        editMode
        open={taskFormOpen}
        onDone={closeTaskForm}
        onClose={closeTaskForm}
        task={task}
      />
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <AdditionalActions actions={additionalActions} />
          {selectedEvent && (
            <>
              <ContextMenuItem
                inset
                onClick={() =>
                  createRelationship({
                    source_id: selectedEvent.id,
                    source_type: RelationshipEntityType.Event,
                    target_id: task.id,
                    target_type: RelationshipEntityType.Task,
                    relationship_type: RelationshipType.Contains,
                  })
                }
              >
                <IconCalendarPlus />
                Add to the active event
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          {task.status === "done" && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: TaskStatus.Doing }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              <IconBackspace />
              Undo
            </ContextMenuItem>
          )}
          {!(task.status === "done") && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: TaskStatus.Done }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              <IconCheck />
              Complete
            </ContextMenuItem>
          )}
          {!task.event_id && task.status === TaskStatus.Doing && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: TaskStatus.Todo }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              <IconProgressDown />
              Deactivate
            </ContextMenuItem>
          )}
          {!task.event_id && !(task.status === TaskStatus.Doing) && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: TaskStatus.Doing }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              <IconProgressCheck />
              Activate
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            <IconEdit />
            Edit
          </ContextMenuItem>
          {!!task.event_id && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { event_id: null, status: TaskStatus.Doing })
              }
            >
              <IconCalendarCancel />
              Remove from event
            </ContextMenuItem>
          )}
          {!!task.deadline && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { deadline: null, status: TaskStatus.Doing })
              }
            >
              <IconCalendarCancel />
              Move to the list
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => deleteTask(task.id)}
            variant="destructive"
          >
            <IconTrash />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
