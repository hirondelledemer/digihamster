import { FC } from "react";
import { IProject } from "@/app/utils/types/project";

export interface ProjectProgressBarProps {
  project: IProject;
  activeCount: number;
  completedCount: number;
  allCount: number;
}

export const ProjectProgressBar: FC<ProjectProgressBarProps> = ({
  project,
  activeCount,
  completedCount,
  allCount,
}) => {
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
          width: `${((activeCount + completedCount) / allCount) * 100}%`,
          background: `repeating-linear-gradient(135deg, ${project.color}, ${project.color} 2px, transparent 2px, transparent 4px)`,
        }}
      >
        <div
          data-testid="progress-bar-inner"
          style={{
            height: "100%",
            backgroundColor: project.color,

            width: `${
              (completedCount / (activeCount + completedCount)) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
};
