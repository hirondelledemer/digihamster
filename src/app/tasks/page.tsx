import CommandTool from "../components/CommandTool";
import Tasks from "../components/Tasks";
import { ProjectsContextProvider } from "../utils/hooks/use-projects";
import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function TasksPage() {
  return (
    <ProjectsContextProvider>
      <TasksContextProvider>
        <CommandTool />
        <Tasks />
      </TasksContextProvider>
    </ProjectsContextProvider>
  );
}
