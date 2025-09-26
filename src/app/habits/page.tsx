import CommandTool from "../components/CommandTool";
import Habits from "../components/Habits";

import { HabitsContextProvider } from "../utils/hooks/use-habits";
import { LifeAspectsContextProvider } from "../utils/hooks/use-life-aspects/provider";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function HabitsPage() {
  return (
    <HabitsContextProvider>
      <TasksContextProvider>
        <ProjectsContextProvider>
          <LifeAspectsContextProvider>
            <Habits />
            <CommandTool />
          </LifeAspectsContextProvider>
        </ProjectsContextProvider>
      </TasksContextProvider>
    </HabitsContextProvider>
  );
}
