import React, { ReactNode, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TaskWithRelations } from "@/app/utils/types/task";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import NoteForm from "../NoteForm";
import TaskFormModal from "../TaskFormModal";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";

interface TaskActionProps {
  children: ReactNode;
  task: TaskWithRelations;
}

export const TaskActions: React.FC<TaskActionProps> = ({ children, task }) => {
  const [addNoteFormOpen, setAddNoteFormOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { updateTask: editTask } = useTasksNewActions();

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
          <NoteForm
            onDone={() => setAddNoteFormOpen(false)}
            parentTaskId={task.id}
          />
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
          <ContextMenuItem inset onClick={() => setAddNoteFormOpen(true)}>
            Add note
          </ContextMenuItem>
          {task.status === "done" && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: "doing" }, () =>
                  setTaskFormOpen(false),
                )
              }
            >
              Undo
            </ContextMenuItem>
          )}
          {!(task.status === "done") && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: "done" }, () =>
                  setTaskFormOpen(false),
                )
              }
            >
              Complete
            </ContextMenuItem>
          )}
          {!task.event_id && task.status === "doing" && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: "todo" }, () =>
                  setTaskFormOpen(false),
                )
              }
            >
              Deactivate
            </ContextMenuItem>
          )}
          {!task.event_id && !(task.status === "doing") && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task.id, { status: "doing" }, () =>
                  setTaskFormOpen(false),
                )
              }
            >
              Activate
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            Edit
          </ContextMenuItem>
          {!!task.event_id && (
            <ContextMenuItem
              inset
              onClick={() => editTask(task.id, { event_id: null })}
            >
              Remove from event
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
