"use client";
import React, { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "../utils";
import useTasks from "@/app/utils/hooks/use-tasks";
import TaskCard from "../TaskCard";

export interface TaskInfoProps {
  testId?: string;
}

const TaskInfo: FC<TaskInfoProps> = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const taskId = searchParams.get("taskId");

  const { data: tasks } = useTasks();

  const selectedTask = tasks.find((t) => t._id === taskId);

  if (!selectedTask) {
    return null;
  }
  const relatedTasks = selectedTask
    ? tasks.filter((t) => selectedTask.relatedTaskIds.includes(t._id))
    : [];

  return (
    <Sheet open={!!taskId}>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => router.replace("/", undefined)}
        showOverlay={false}
      >
        <SheetHeader>
          <SheetTitle>{selectedTask.title}</SheetTitle>
        </SheetHeader>
        <div className={cn(["flex flex-col gap-2"])}>
          {relatedTasks.map((rTask) => (
            <TaskCard task={rTask} key={rTask._id} dragId={rTask._id} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskInfo;
