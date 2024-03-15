import Tasks from "../components/Tasks";
import { ProjectsContextProvider } from "../utils/hooks/use-projects";
import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function SignupPage() {
  return (
    <ProjectsContextProvider>
      <TasksContextProvider>
        <Tasks />
      </TasksContextProvider>
    </ProjectsContextProvider>
  );
}
