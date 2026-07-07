"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useTasksNewActions } from "./use-tasks-new/actions-context";

export const DraggableTasksContextProvider = ({ children }: any) => {
  const { updateTask: editTask } = useTasksNewActions();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
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
            console.log("aaaaa", props.active.data.current?.id, {
              event_id: Number(props.over?.id),
            });
            editTask(props.active.data.current?.id, {
              event_id: Number(props.over?.id),
            });
          }
        }
      }}
    >
      {children}
    </DndContext>
  );
};
