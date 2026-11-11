import { useTaskProjectColor } from "@/app/utils/hooks/use-projects/selectors";
import { useTaskById } from "@/app/utils/hooks/use-tasks/selectors";
import { LifeAspectBoost } from "@/app/utils/types/life-aspect";
import { FC } from "react";
import { EntryContainer } from "./EntryContainer";

/*
  NOTE: for now we only handle boosts that come from tasks. Other possible options are:
  "habit" | "event" | "manual" | "ai". But no feature around them are developed yet.

  Possible features:
  "event" -> add boost when event related to specific project is completed
*/
export const BoostEntry: FC<{ boost: LifeAspectBoost }> = ({ boost }) => {
  const task = useTaskById(
    boost.source_type === "task" ? boost.source_id : null
  );
  const color = useTaskProjectColor(task);

  return (
    <EntryContainer
      style={task ? { color: color.main } : undefined}
      value={boost.value}
      title={boost.source_type === "task" && task ? task.title : "unknown"}
      date={boost.created_at}
    />
  );
};
