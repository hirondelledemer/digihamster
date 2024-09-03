import { Project } from "@/models/project";
import { TaskV2 } from "@/models/taskV2";

export const getProjectPercentages = (
  tasks: TaskV2[],
  allProjects: Project[]
): { [key: string]: { percentage: number; color: string } } => {
  const projects = tasks.map((task) => task.projectId || "");
  const uniqueProjects = projects.filter(
    (projectId, index) => projects.indexOf(projectId) === index
  );
  const projectObj = {};
  const totalEstimate = tasks.reduce(
    (totalEstimate, currentTask) => totalEstimate + (currentTask.estimate || 0),
    0
  );
  return uniqueProjects.reduce((obj, projectId) => {
    return {
      ...obj,
      [projectId]: {
        percentage:
          (tasks
            .filter((task) => task.projectId === projectId)
            .reduce(
              (totalEstimate, currentTask) =>
                totalEstimate + (currentTask.estimate || 0),
              0
            ) /
            totalEstimate) *
          100,
        color: allProjects.find((project) => project._id === projectId)?.color,
      },
    };
  }, projectObj);
};
