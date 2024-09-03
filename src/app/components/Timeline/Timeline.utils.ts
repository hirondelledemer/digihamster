import { JournalEntry } from "@/models/entry";
import { Project } from "@/models/project";
import { TaskV2 } from "@/models/taskV2";
import { Event } from "@/models/event";
import { differenceInHours } from "date-fns";
import { PercentagesData } from "../PercentagesBar/PercentagesBar";

export const getProjectPercentages = (
  tasks: TaskV2[],
  allProjects: Project[],
  events: Event[]
): PercentagesData => {
  const projects = tasks.map((task) => task.projectId || "");
  const uniqueProjects = projects.filter(
    (projectId, index) => projects.indexOf(projectId) === index
  );

  const eventsCompleteTime = events.reduce(
    (acc: number, val: Event) =>
      acc + differenceInHours(val.endAt, val.startAt),
    0
  );

  const totalEstimate =
    tasks.reduce(
      (totalEstimate, currentTask) =>
        totalEstimate + (currentTask.estimate || 0),
      0
    ) + eventsCompleteTime;

  const projectObj = {
    events: {
      percentage: (eventsCompleteTime / totalEstimate) * 100,
      estimate: eventsCompleteTime,
      color: "#713f12",
      label: `Meetings: ${eventsCompleteTime}`,
    },
  };

  return uniqueProjects.reduce((obj, projectId) => {
    const eta = tasks
      .filter((task) => task.projectId === projectId)
      .reduce(
        (totalEstimate, currentTask) =>
          totalEstimate + (currentTask.estimate || 0),
        0
      );
    return {
      ...obj,
      [projectId]: {
        percentage: (eta / totalEstimate) * 100,
        estimate: eta,
        label: `${allProjects.find((project) => project._id === projectId)?.title}: ${eta}`,
        color: allProjects.find((project) => project._id === projectId)?.color,
      },
    };
  }, projectObj);
};

export function isTask(entry: TaskV2 | JournalEntry | Event): entry is TaskV2 {
  return (entry as TaskV2).deadline !== undefined;
}

export function isEvent(entry: TaskV2 | JournalEntry | Event): entry is Event {
  return (entry as Event).startAt !== undefined;
}

export function isJournalEntry(
  entry: TaskV2 | JournalEntry | Event
): entry is JournalEntry {
  return (entry as JournalEntry).note !== undefined;
}
