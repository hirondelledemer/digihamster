import { generateCustomTasksList } from "@/app/utils/mocks/task";
import { TaskV2 } from "@/models/taskV2";
import { getProjectPercentages } from "./Timeline.utils";
import { Project } from "@/models/project";
import { generateCustomProjectsList } from "@/app/utils/mocks/project";

describe("Timeline.utils", () => {
  it("should return percentages of projects", () => {
    const data: TaskV2[] = generateCustomTasksList([
      {
        projectId: "1",
        estimate: 0.5,
      },
      {
        projectId: "1",
        estimate: 1,
      },
      {
        projectId: "2",
        estimate: 0.5,
      },
    ]);

    const projects: Project[] = generateCustomProjectsList([
      {
        _id: "1",
        color: "color1",
      },
      {
        _id: "2",
        color: "color2",
      },
    ]);

    expect(getProjectPercentages(data, projects, [])).toStrictEqual({
      1: {
        percentage: 75,
        color: "color1",
        estimate: 1.5,
        label: "Project 0",
      },
      2: {
        percentage: 25,
        color: "color2",
        estimate: 0.5,
        label: "Project 1",
      },
      events: {
        color: "#713f12",
        estimate: 0,
        label: "Meetings",
        percentage: 0,
      },
    });
  });
});
