"use client";
import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "../utils";
import useTasks from "@/app/utils/hooks/use-tasks";
import TaskCard from "../TaskCard";
import CreateTaskForm from "../CreateTaskForm";
import { ScrollArea } from "../ui/scroll-area";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import MinimalNote from "../MinimalNote";

export interface TaskInfoProps {
  testId?: string;
}

const TaskInfo: FC<TaskInfoProps> = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = searchParams.get("taskId");
  const projectId = searchParams.get("projectId");

  const { data: tasks } = useTasks();
  const { getProjectById, isLoading } = useProjectsState();

  const selectedTask = tasks.find((t) => t._id === taskId);

  const selectedProject =
    projectId && !isLoading ? getProjectById(projectId) : null;

  if (!selectedTask && !selectedProject) {
    return null;
  }

  const title = selectedTask ? selectedTask.title : selectedProject?.title;

  const tasksToShow = selectedTask
    ? tasks.filter((t) => selectedTask.relatedTaskIds.includes(t._id))
    : tasks.filter((t) => t.projectId === projectId);

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
                <MinimalNote note={selectedProject.jsonDescription} />
              </div>
            )}
            {tasksToShow.map((rTask) => (
              <TaskCard
                task={rTask}
                key={rTask._id}
                dragId={rTask._id}
                indicateActive
              />
            ))}
          </div>
        </ScrollArea>

        <CreateTaskForm
          onDone={() => {}}
          primaryTaskId={selectedTask?._id}
          projectId={
            selectedTask
              ? selectedTask.projectId || undefined
              : selectedProject
              ? selectedProject._id
              : undefined
          }
        />
      </SheetContent>
    </Sheet>
  );
};

export default TaskInfo;
