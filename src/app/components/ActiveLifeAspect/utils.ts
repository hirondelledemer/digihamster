import { HabitLog } from "@/app/utils/types/habit";
import { LifeAspectBoost } from "@/app/utils/types/life-aspect";

export function isBoostEntry(
  entry: LifeAspectBoost | HabitLog
): entry is LifeAspectBoost {
  return "source_type" in entry;
}
