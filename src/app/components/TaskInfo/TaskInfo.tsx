"use client";
import React, { FC, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "../utils";
import CreateTaskForm from "../CreateTaskForm";
import { ScrollArea } from "../ui/scroll-area";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import MinimalNote from "../MinimalNote";
import { useRouter, useSearchParams } from "#lib/navigation";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { DraggableTaskCard } from "../TaskCard/DraggableTaskCard";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTaskCard } from "../TaskCard/SortableTaskCard";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { TaskStatus } from "@/app/utils/types/task";

export interface TaskInfoProps {
  testId?: string;
}

const TaskInfo: FC<TaskInfoProps> = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allowSorting, setAllowSorting] = useState<boolean>(false);
  const { reorderTasksInTheProject } = useTasksNewActions();

  const projectId = searchParams.get("projectId"); // TODO: convert to number

  const { data: tasks } = useTasksNewState();

  const selectedProject = useProjectById(projectId ? Number(projectId) : null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!selectedProject) {
    return null;
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasksToSort.findIndex((task) => task.id === active.id);
    const newIndex = tasksToSort.findIndex((task) => task.id === over.id);
    const reordered = arrayMove(tasksToSort, oldIndex, newIndex);

    reorderTasksInTheProject(
      Number(projectId),
      reordered.map((task) => task.id)
    );
  };

  const tasksToSort = tasks
    .filter((t) => t.project_id && t.project_id.toString() === projectId)
    .sort(
      (taskA, taskB) =>
        (taskA.project_sort_order || 0) - (taskB.project_sort_order || 0)
    );

  const tasksToShow = tasksToSort.filter(
    (t) => t.status === TaskStatus.Todo || t.status === TaskStatus.Doing
  );

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => router.replace("/", undefined)}
        onEscapeKeyDown={() => router.replace("/", undefined)}
      >
        <SheetHeader>
          <SheetTitle>{selectedProject?.title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-3/4 mb-2 mt-4">
          <div className={cn(["flex flex-col gap-2"])}>
            {selectedProject && (
              <div className="w-[300px]">
                <MinimalNote note={selectedProject.description} />
              </div>
            )}
            <div className="space-x-2 flex items-center">
              <Label>Sort:</Label>
              <Switch
                checked={allowSorting}
                onCheckedChange={setAllowSorting}
              />
            </div>

            {allowSorting ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tasksToSort}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2 mt-2">
                    {tasksToSort.map((task) => (
                      <SortableTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              tasksToShow.map((rTask) => (
                <DraggableTaskCard
                  task={rTask}
                  key={rTask.id}
                  dragId={rTask.id}
                  indicateActive
                />
              ))
            )}
          </div>
        </ScrollArea>

        <CreateTaskForm
          onDone={() => {}}
          projectId={selectedProject ? selectedProject.id : undefined}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TaskInfo;
