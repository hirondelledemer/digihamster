"use client";

import { DndContext } from "@dnd-kit/core";
import useEditTask from "./use-edit-task";

export const DraggableTasksContextProvider = ({ children }: any) => {
  const { editTask } = useEditTask();

  return (
    <DndContext
      onDragEnd={(props) => {
        console.log(props);
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
