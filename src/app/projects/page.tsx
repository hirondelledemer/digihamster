import CommandTool from "../components/CommandTool";
import Projects from "../components/Projects";
import { LifeAspectsContextProvider } from "../utils/hooks/use-life-aspects/provider";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";
import { TagsContextProvider } from "../utils/hooks/use-tags";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function ProjectsPage() {
  return (
    <ProjectsContextProvider>
      <TagsContextProvider>
        <TasksContextProvider>
          <LifeAspectsContextProvider>
            <CommandTool />
            <Projects />
          </LifeAspectsContextProvider>
        </TasksContextProvider>
      </TagsContextProvider>
    </ProjectsContextProvider>
  );
}
