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
  IconCheck,
  IconEdit,
  IconProgressCheck,
  IconProgressDown,
  IconTrash,
} from "@tabler/icons-react";

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
          {task.status === "done" && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: TaskStatus.Doing }, () =>
                  setTaskFormOpen(false),
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
                  setTaskFormOpen(false),
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
                  setTaskFormOpen(false),
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
                  setTaskFormOpen(false),
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
