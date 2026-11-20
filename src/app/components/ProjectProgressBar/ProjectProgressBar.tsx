import { FC } from "react";

export interface ProjectProgressBarProps {
  color: string;
  activeCount: number;
  completedCount: number;
  allCount: number;
}

export const ProjectProgressBar: FC<ProjectProgressBarProps> = ({
  color,
  activeCount,
  completedCount,
  allCount,
}) => {
  return (
    <div
      data-testid="progress-bar"
      className="w-full h-2"
      style={{
        border: `1px solid ${color}`,
        borderRadius: "3px",
      }}
    >
      {allCount > 0 ? (
        <div
          data-testid="progress-bar-outer"
          style={{
            height: "100%",
            width: `${((activeCount + completedCount) / allCount) * 100}%`,
            background: `repeating-linear-gradient(135deg, ${color}, ${color} 2px, transparent 2px, transparent 4px)`,
          }}
        >
          <div
            data-testid="progress-bar-inner"
            style={{
              height: "100%",
              backgroundColor: color,
              width: `${
                (completedCount / (activeCount + completedCount)) * 100
              }%`,
            }}
          />
        </div>
      ) : (
        <div
          data-testid="error-bar"
          style={{
            height: "100%",
            width: `${((activeCount + completedCount) / allCount) * 100}%`,
            backgroundImage:
              "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)",
          }}
        />
      )}
    </div>
  );
};
