import CommandTool from "../components/CommandTool";
import Projects from "../components/Projects";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";
import { TagsContextProvider } from "../utils/hooks/use-tags";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function ProjectsPage() {
  return (
    <ProjectsContextProvider>
      <TagsContextProvider>
        <TasksContextProvider>
          <CommandTool />
          <Projects />
        </TasksContextProvider>
      </TagsContextProvider>
    </ProjectsContextProvider>
  );
}
