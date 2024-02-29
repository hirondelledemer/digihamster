import { Home as HomeComp } from "../components/Home/Home";
import { EntriesContextProvider } from "../utils/hooks/use-entry";
import { EventsContextProvider } from "../utils/hooks/use-events";
import { ProjectsContextProvider } from "../utils/hooks/use-projects";

export default function SignupPage() {
  return (
    <EntriesContextProvider>
      <EventsContextProvider>
        <ProjectsContextProvider>
          <HomeComp />
        </ProjectsContextProvider>
      </EventsContextProvider>
    </EntriesContextProvider>
  );
}
