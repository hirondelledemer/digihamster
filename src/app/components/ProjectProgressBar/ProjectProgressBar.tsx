import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { IProject } from "@/app/utils/types/project";
import { FC, useMemo } from "react";

export interface ProjectProgressBarProps {
  project: IProject;
}

export const ProjectProgressBar: FC<ProjectProgressBarProps> = ({
  project,
}) => {
  const { data: tasks } = useTasksNewState();

  const allTasks = useMemo(
    () => tasks.filter((task) => task.project_id === project.id),
    [project.id, tasks],
  );
  const activeTaskCount = useMemo(
    () => allTasks.filter((task) => task.status === "doing").length,
    [allTasks],
  );

  const completedTaskCount = useMemo(
    () => allTasks.filter((task) => task.status === "done").length,
    [allTasks],
  );

  return (
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
              (completedTaskCount / (activeTaskCount + completedTaskCount)) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  );
};
