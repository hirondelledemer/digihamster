import CommandTool from "../components/CommandTool";
import Tasks from "../components/Tasks";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";
import { TagsContextProvider } from "../utils/hooks/use-tags";
import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function TasksPage() {
  return (
    <ProjectsContextProvider>
      <TasksContextProvider>
        <TagsContextProvider>
          <CommandTool />
          <Tasks />
        </TagsContextProvider>
      </TasksContextProvider>
    </ProjectsContextProvider>
  );
}
