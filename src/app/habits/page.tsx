import Habits from "../components/Habits";

import { HabitsContextProvider } from "../utils/hooks/use-habits";

export default function HabitsPage() {
  return (
    <HabitsContextProvider>
      <Habits />
    </HabitsContextProvider>
  );
}
