import { Home as HomeComp } from "../components/Home/Home";
import Timeline from "../components/Timeline";
import { EntriesContextProvider } from "../utils/hooks/use-entry";
import { EventsContextProvider } from "../utils/hooks/use-events";
import { ProjectsContextProvider } from "../utils/hooks/use-projects";
import { TagsContextProvider } from "../utils/hooks/use-tags";

import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function LogsPage() {
  return (
    <EntriesContextProvider>
      <EventsContextProvider>
        <ProjectsContextProvider>
          <TagsContextProvider>
            <TasksContextProvider>
              <Timeline />
            </TasksContextProvider>
          </TagsContextProvider>
        </ProjectsContextProvider>
      </EventsContextProvider>
    </EntriesContextProvider>
  );
}
