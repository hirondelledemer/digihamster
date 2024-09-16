"use client";

import { DndContext } from "@dnd-kit/core";
import useEditTask from "./use-edit-task";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

export const DraggableTasksContextProvider = ({ children }: any) => {
  const { editTask } = useEditTask();

  return (
    <DndContext
      modifiers={[snapCenterToCursor]}
      onDragEnd={(props) => {
        if (props.over) {
          editTask(props.active.id.toString(), {
            eventId: props.over?.id.toString(),
          });
        }
      }}
    >
      {children}
    </DndContext>
  );
};
