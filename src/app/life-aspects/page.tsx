import { LifeAspectsContextProvider } from "@/app/utils/hooks/use-life-aspects/provider";
import { LifeAspectsEditor } from "@/app/components/LifeAspectsEditor/LifeAspectsEditor";

export default function LifeAspectsPage() {
  return (
    <LifeAspectsContextProvider>
      <LifeAspectsEditor />
    </LifeAspectsContextProvider>
  );
}
