import CommandTool from "../components/CommandTool";
import Habits from "../components/Habits";

import { HabitsContextProvider } from "../utils/hooks/use-habits";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function HabitsPage() {
  return (
    <HabitsContextProvider>
      <TasksContextProvider>
        <ProjectsContextProvider>
          <Habits />
          <CommandTool />
        </ProjectsContextProvider>
      </TasksContextProvider>
    </HabitsContextProvider>
  );
}
