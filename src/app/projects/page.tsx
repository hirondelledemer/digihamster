import Projects from "../components/Projects";
import { ProjectsContextProvider } from "../utils/hooks/use-projects";
import { TagsContextProvider } from "../utils/hooks/use-tags";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function ProjectsPage() {
  return (
    <ProjectsContextProvider>
      <TagsContextProvider>
        <TasksContextProvider>
          <Projects />
        </TasksContextProvider>
      </TagsContextProvider>
    </ProjectsContextProvider>
  );
}
