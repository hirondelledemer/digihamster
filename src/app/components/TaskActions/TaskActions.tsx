import React, { ReactNode, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import TaskFormModal from "../TaskFormModal";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
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
}

export const TaskActions: React.FC<TaskActionProps> = ({ children, task }) => {
  const [addNoteFormOpen, setAddNoteFormOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { updateTask: editTask, deleteTask } = useTasksNewActions();

  const closeTaskForm = () => setTaskFormOpen(false);

  return (
    <>
      <Sheet open={addNoteFormOpen}>
        <SheetContent
          side="right"
          onCloseClick={() => setAddNoteFormOpen(false)}
          showOverlay={false}
          onEscapeKeyDown={() => setAddNoteFormOpen(false)}
        >
          <SheetHeader>
            <SheetTitle>Add note</SheetTitle>
          </SheetHeader>
          {/* <NoteForm
            onDone={() => setAddNoteFormOpen(false)}
            parentTaskId={task.id}
          /> */}
        </SheetContent>
      </Sheet>
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
          {/* <ContextMenuItem inset onClick={() => setAddNoteFormOpen(true)}>
            Add note
          </ContextMenuItem> */}
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
