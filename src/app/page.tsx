import { Home as HomeComp } from "./components/Home/Home";
import { EntriesContextProvider } from "./utils/hooks/use-entry";

import { NotesContextProvider } from "./utils/hooks/use-notes";
import { TagsContextProvider } from "./utils/hooks/use-tags";

import { TasksContextProvider } from "./utils/hooks/use-tasks";
import { DraggableTasksContextProvider } from "./utils/hooks/use-draggable-tasks";
import { HabitsContextProvider } from "./utils/hooks/use-habits";
import { CycleContextProvider } from "./utils/hooks/use-cycle";
import { EventsContextProvider } from "./utils/hooks/use-events/provider";
import { CalendarDateContextProvider } from "./utils/hooks/use-calendar-date";
import { ProjectsContextProvider } from "./utils/hooks/use-projects/provider";

export default function HomePage() {
  return (
    <EntriesContextProvider>
      <NotesContextProvider>
        <EventsContextProvider>
          <ProjectsContextProvider>
            <TagsContextProvider>
              <TasksContextProvider>
                <HabitsContextProvider>
                  <CycleContextProvider>
                    <DraggableTasksContextProvider>
                      <CalendarDateContextProvider>
                        <HomeComp />
                      </CalendarDateContextProvider>
                    </DraggableTasksContextProvider>
                  </CycleContextProvider>
                </HabitsContextProvider>
              </TasksContextProvider>
            </TagsContextProvider>
          </ProjectsContextProvider>
        </EventsContextProvider>
      </NotesContextProvider>
    </EntriesContextProvider>
  );
}
