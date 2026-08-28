import Timeline from "../components/Timeline";
import { TooltipProvider } from "../components/ui/tooltip";
import { EntriesContextProvider } from "../utils/hooks/use-entry/provider";
import { EventsContextProvider } from "../utils/hooks/use-events/provider";
import { ProjectsContextProvider } from "../utils/hooks/use-projects/provider";

import { TagsContextProvider } from "../utils/hooks/use-tags/provider";

// import { TasksContextProvider } from "../utils/hooks/use-tasks";

export default function LogsPage() {
  return (
    <EntriesContextProvider>
      <EventsContextProvider>
        <ProjectsContextProvider>
          <TagsContextProvider>
            <TooltipProvider>
              {/* <TasksContextProvider> */}
              <Timeline />
              {/* </TasksContextProvider> */}
            </TooltipProvider>
          </TagsContextProvider>
        </ProjectsContextProvider>
      </EventsContextProvider>
    </EntriesContextProvider>
  );
}
