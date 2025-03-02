"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import useEditTask from "./use-edit-task";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

export const DraggableTasksContextProvider = ({ children }: any) => {
  const { editTask } = useEditTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      modifiers={[snapCenterToCursor]}
      sensors={sensors}
      onDragEnd={(props) => {
        if (props.over) {
          if (props.over.data.current?.containerType === "calendar") {
            editTask(props.active.data.current?.id.toString(), {
              deadline: props.over.data.current.date,
            });
          } else {
            editTask(props.active.data.current?.id.toString(), {
              eventId: props.over?.id.toString(),
            });
          }
        }
      }}
    >
      {children}
    </DndContext>
  );
};
