import TimeSpacesManager from "../components/TimeSpacesManager";
import { TimeSpacesContextProvider } from "../utils/hooks/use-time-spaces/provider";

export default function TimeSpacesPage() {
  return (
    <TimeSpacesContextProvider>
      <TimeSpacesManager />
    </TimeSpacesContextProvider>
  );
}
