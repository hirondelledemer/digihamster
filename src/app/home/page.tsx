import { Home as HomeComp } from "../components/Home/Home";
import { EntriesContextProvider } from "../utils/hooks/use-entry";
import { EventsContextProvider } from "../utils/hooks/use-events";

export default function SignupPage() {
  return (
    <EntriesContextProvider>
      <EventsContextProvider>
        <HomeComp />
      </EventsContextProvider>
    </EntriesContextProvider>
  );
}
