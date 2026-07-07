"use client";
import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "../utils";
import TaskCard from "../TaskCard";
import CreateTaskForm from "../CreateTaskForm";
import { ScrollArea } from "../ui/scroll-area";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import MinimalNote from "../MinimalNote";
import { useRouter, useSearchParams } from "#lib/navigation";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";

export interface TaskInfoProps {
  testId?: string;
}

const TaskInfo: FC<TaskInfoProps> = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = searchParams.get("projectId");

  const { data: tasks } = useTasksNewState();

  const { getProjectById, isLoading } = useProjectsState();

  const selectedProject =
    projectId && !isLoading ? getProjectById(projectId) : null;

  if (!selectedProject) {
    return null;
  }

  const title = selectedProject?.title;

  const tasksToShow = tasks.filter(
    (t) => t.project_id && t.project_id.toString() === projectId,
  );

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => router.replace("/", undefined)}
        showOverlay={false}
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
              <TaskCard
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
          // primaryTaskId={selectedTask?.id}
          projectId={selectedProject ? selectedProject._id : undefined}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TaskInfo;
