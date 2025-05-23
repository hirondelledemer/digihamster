import React, { ReactNode, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TaskWithRelations } from "@/app/utils/types/task";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import NoteForm from "../NoteForm";
import TaskFormModal from "../TaskFormModal";

interface TaskActionProps {
  children: ReactNode;
  task: TaskWithRelations;
}

export const TaskActions: React.FC<TaskActionProps> = ({ children, task }) => {
  const [addNoteFormOpen, setAddNoteFormOpen] = useState<boolean>(false);
  const [taskFormOpen, setTaskFormOpen] = useState<boolean>(false);
  const { editTask } = useEditTask();

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
            parentTaskId={task._id}
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
          {task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: false }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Undo
            </ContextMenuItem>
          )}
          {!task.completed && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { completed: true }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Complete
            </ContextMenuItem>
          )}
          {!task.eventId && task.isActive && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { isActive: false }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Deactivate
            </ContextMenuItem>
          )}
          {!task.eventId && !task.isActive && (
            <ContextMenuItem
              inset
              onClick={() =>
                editTask(task._id, { isActive: true }, () =>
                  setTaskFormOpen(false)
                )
              }
            >
              Activate
            </ContextMenuItem>
          )}
          <ContextMenuItem inset onClick={() => setTaskFormOpen(true)}>
            Edit
          </ContextMenuItem>
          {!!task.eventId && (
            <ContextMenuItem
              inset
              onClick={() => editTask(task._id, { eventId: null })}
            >
              Remove from event
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
