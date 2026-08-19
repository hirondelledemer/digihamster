"use client";
import React, { FC, useCallback, useMemo } from "react";

import { now } from "@/app/utils/date/now";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { IProject, ProjectStatus } from "@/app/utils/types/project";
import { addDays, differenceInCalendarDays, format, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { ProjectProgressBar } from "../ProjectProgressBar";

// TODO: project should have normal reusable card
const ProjectProgressItem: FC<{ project: IProject }> = ({
  project,
}): JSX.Element => {
  const { data: tasks } = useTasksNewState();

  const router = useRouter();

  const allTasks = useMemo(
    () => tasks.filter((task) => task.project_id === project.id),
    [project.id, tasks],
  );

  const getCompletionEta = useCallback(() => {
    const completedTasksDates = allTasks
      .filter((task) => task.status === "done")
      .sort(
        (a, b) =>
          new Date(a.completed_at!).valueOf() -
          new Date(b.completed_at!).valueOf(),
      )
      .map((task) => task.completed_at);

    const remainingTasksCount = allTasks.filter(
      (task) => !(task.status === "done"),
    ).length;

    const dateDiff =
      differenceInCalendarDays(now(), completedTasksDates[0]!) || 1;

    const completionRate = completedTasksDates.length / dateDiff;

    const etaDate = addDays(now(), remainingTasksCount * completionRate);

    if (isValid(etaDate)) {
      return format(etaDate, "MMM dd");
    }
    return "date unknown";
  }, [allTasks]);

  return (
    <div
      key={project.id}
      className="flex flex-col gap-5 hover:font-semibold cursor-pointer"
      style={{ color: project.color }}
      onClick={() => router.push(`/?projectId=${project.id}`, undefined)}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          {project.title} ({getCompletionEta()})
        </div>
        <ProjectProgressBar project={project} />
      </div>
    </div>
  );
};

const ProjectProgress: FC = (): JSX.Element => {
  const { data: projects } = useProjectsState();

  const activeProjects = projects
    .filter((project) => project.status === ProjectStatus.Doing)
    // .sortBy((a, b) => a.sort_order - b.sort_order);
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-3">
      {activeProjects.map((project) => (
        <ProjectProgressItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectProgress;
