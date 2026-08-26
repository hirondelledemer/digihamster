"use client";
import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "../utils";
import CreateTaskForm from "../CreateTaskForm";
import { ScrollArea } from "../ui/scroll-area";
import { useProjectById } from "@/app/utils/hooks/use-projects/selectors";
import MinimalNote from "../MinimalNote";
import { useRouter, useSearchParams } from "#lib/navigation";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { ITask } from "@/app/utils/types/task";
import { DraggableTaskCard } from "../TaskCard/DraggableTaskCard";

export interface TaskInfoProps {
  testId?: string;
}

const TaskInfo: FC<TaskInfoProps> = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = searchParams.get("projectId"); // TODO: convert to number

  const { data: tasks } = useTasksNewState();

  const selectedProject = useProjectById(projectId ? Number(projectId) : null);

  if (!selectedProject) {
    return null;
  }

  const title = selectedProject?.title;

  const tasksToShow = tasks
    .filter((t) => t.project_id && t.project_id.toString() === projectId)
    .sort((taskA, taskB) => {
      // Helper helpers to identify priority tiers
      const isPriority = (t: ITask) =>
        t.status === "doing" || !!t.event_id || !!t.deadline;
      const isDone = (t: ITask) => t.status === "done";

      // 1. Check "done" status (Done tasks always go to the bottom)
      if (isDone(taskA) !== isDone(taskB)) {
        return isDone(taskA) ? 1 : -1;
      }

      // 2. Check priority status (Active/scheduled tasks go above regular Todo tasks)
      if (isPriority(taskA) !== isPriority(taskB)) {
        return isPriority(taskA) ? -1 : 1;
      }

      // 3. Fallback: If they are in the same priority group, sort by date (Oldest first)
      return (
        new Date(taskA.created_at).valueOf() -
        new Date(taskB.created_at).valueOf()
      );
    });

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => router.replace("/", undefined)}
        // showOverlay={false}
        onEscapeKeyDown={() => router.replace("/", undefined)}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-3/4 mb-2 mt-4">
          <div className={cn(["flex flex-col gap-2"])}>
            {selectedProject && (
              <div className="w-[300px]">
                <MinimalNote note={selectedProject.description} />
              </div>
            )}

            {tasksToShow.map((rTask) => (
              <DraggableTaskCard
                task={rTask}
                key={rTask.id}
                dragId={rTask.id}
                indicateActive
              />
            ))}
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
