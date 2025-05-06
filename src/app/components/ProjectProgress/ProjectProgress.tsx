"use client";
import { now } from "@/app/utils/date/date";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import useTasks from "@/app/utils/hooks/use-tasks";
import { Project } from "@/models/project";
import { addDays, differenceInCalendarDays, format, isValid } from "date-fns";
import { useRouter } from "next/navigation";

import React, { FC, useCallback, useMemo } from "react";

export interface ProjectProgressProps {
  testId?: string;
}

const ProjectProgressBar: FC<{ project: Project }> = ({
  project,
}): JSX.Element => {
  const { data: tasks } = useTasks();

  const router = useRouter();

  const allTasks = useMemo(
    () => tasks.filter((task) => task.projectId === project._id),
    [project._id, tasks]
  );

  const activeTaskCount = useMemo(
    () => allTasks.filter((task) => task.isActive && !task.completed).length,
    [allTasks]
  );

  const getCompletionEta = useCallback(() => {
    const completedTasksDates = allTasks
      .filter((task) => task.completed)
      .sort((a, b) => a.completedAt! - b.completedAt!)
      .map((task) => task.completedAt);

    const remainingTasksCount = allTasks.filter(
      (task) => !task.completed
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

  const completedTaskCount = useMemo(
    () => allTasks.filter((task) => task.completed).length,
    [allTasks]
  );

  return (
    <div
      key={project._id}
      className="flex flex-col gap-5 hover:font-semibold cursor-pointer"
      style={{ color: project.color }}
      onClick={() => router.push(`/?projectId=${project._id}`, undefined)}
    >
      <div className="flex flex-col">
        <div className="text-sm">
          {project.title} ({getCompletionEta()})
        </div>
        <div
          data-testid="progress-bar"
          className="w-full h-2"
          style={{
            border: `1px solid ${project.color}`,
            borderRadius: "3px",
          }}
        >
          <div
            data-testid="progress-bar-outer"
            style={{
              height: "100%",
              width: `${
                ((activeTaskCount + completedTaskCount) / allTasks.length) * 100
              }%`,
              background: `repeating-linear-gradient(135deg, ${project.color}, ${project.color} 2px, transparent 2px, transparent 4px)`,
            }}
          >
            <div
              data-testid="progress-bar-inner"
              style={{
                height: "100%",
                backgroundColor: project.color,

                width: `${
                  (completedTaskCount /
                    (activeTaskCount + completedTaskCount)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectProgress: FC<ProjectProgressProps> = (): JSX.Element => {
  const { data: projects } = useProjectsState();

  const activeProjects = projects.filter((project) => !project.disabled);

  return (
    <div className="flex flex-col gap-3">
      {activeProjects.map((project) => (
        <ProjectProgressBar key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectProgress;
