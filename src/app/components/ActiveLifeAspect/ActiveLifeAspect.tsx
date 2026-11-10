"use client";

import { CSSProperties, FC, ReactNode, SVGProps } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useSearchParams } from "next/navigation";
import { useSetSearchParams } from "@/app/utils/url/search-params";
import {
  useLifeAspectAssetIcon,
  useLifeAspectById,
} from "@/app/utils/hooks/use-life-aspects/selectors";
import { LifeAspectBarChart } from "./LifeAspectBarChart";
import {
  useHabitById,
  useHabitsByLifeAspectId,
} from "@/app/utils/hooks/use-habits-new/selectors";
import { ScrollArea } from "../ui/scroll-area";
import {
  LifeAspectAsset,
  LifeAspectBoost,
} from "@/app/utils/types/life-aspect";
import { useTaskById } from "@/app/utils/hooks/use-tasks/selectors";
import { compareAsc, compareDesc, format, subMonths } from "date-fns";
import { useTaskProjectColor } from "@/app/utils/hooks/use-projects/selectors";
import { HabitLog } from "@/app/utils/types/habit";
import { cn } from "../utils";
import { now } from "@/app/utils/date/now";
import { River } from "../Garden/components/River";
import { Mountains } from "../Garden/components/Mountains";
import { House } from "../Garden/components/House";
import { Tree } from "../Garden/components/Tree";
import { Shed } from "../Garden/components/Shed";
import { Animals } from "../Garden/components/Animals";
import { PumpkinGarden } from "../Garden/components/PumkinGarden"; // TODO: fix folder typo
import { getHabitProgressForLifeAspect } from "@/app/utils/habits/habit-progress";

type GardenAsset = (
  props: { stage: number; withBoosts: boolean } & SVGProps<SVGSVGElement>
) => ReactNode;

/**
 * Each asset is drawn in the Garden scene's coordinates, so on its own it needs
 * a viewBox framing just that asset. These are the artwork bounds at stages
 * 2-10 plus 4% padding — the haunted-stage mist decorations sit at fixed
 * coordinates well outside the artwork and are deliberately left out of frame.
 */
const ASPECT_TO_ASSET_MAP: Record<
  LifeAspectAsset,
  { Component: GardenAsset; viewBox: string }
> = {
  house: { Component: House, viewBox: "457 46 335 310" },
  tree: { Component: Tree, viewBox: "-21 59 388 405" },
  shed: { Component: Shed, viewBox: "-2 74 516 455" },
  animals: { Component: Animals, viewBox: "1 57 631 442" },
  river: { Component: River, viewBox: "11 -24 708 621" },
  mountains: { Component: Mountains, viewBox: "17 -10 708 279" },
  pumpkinGarden: { Component: PumpkinGarden, viewBox: "617 255 814 386" },
};
const LogContainer: FC<{
  value: number;
  title: string;
  date: string;
  style?: CSSProperties;
}> = ({ value, title, date, style }) => {
  return (
    <tr className={cn("py-[3px] leading-2")} style={style}>
      <td className="w-6 border border-[2px] border-dotted border-l-0">
        {value}
      </td>
      <td className="max-w-12 truncate border border-[2px] border-dotted">
        {title}
      </td>
      <td className="border border-[2px] border-dotted borderrl-0">
        {format(date, "MMM d")}
      </td>
    </tr>
  );
};

const BoostEntry: FC<{ boost: LifeAspectBoost }> = ({ boost }) => {
  const task = useTaskById(
    boost.source_type === "task" ? boost.source_id : null
  );
  const color = useTaskProjectColor(task);

  return (
    <LogContainer
      style={task ? { color: color.main } : undefined}
      value={boost.value}
      title={boost.source_type === "task" && task ? task.title : "unknown"}
      date={boost.created_at}
    />
  );
  // return (
  //   <div className="flex">
  //     <div>{boost.value}</div>
  //     <div>{boost.source_type === "task" && task ? task.title : "unknown"}</div>
  //     <div>{format(boost.created_at, "MMM d")}</div>
  //   </div>
  // );
};

const LogEntry: FC<{ log: HabitLog }> = ({ log }) => {
  // const task = useTaskById(
  //   boost.source_type === "task" ? boost.source_id : null
  // );
  // const color = useTaskProjectColor(task);

  const habit = useHabitById(log.habit_id);

  if (!habit) {
    return <div>No habit. Smth wrong?</div>;
  }

  return <LogContainer value={1} title={habit.title} date={log.created_at} />;
  // return (
  //   <div className="flex">
  //     <div>+1</div>
  //     <div>{habit.title}</div>
  //     <div>{format(log.created_at, "MM d")}</div>
  //   </div>
  // );
};

export const ActiveLifeAspect: FC = (): JSX.Element | null => {
  const searchParams = useSearchParams();
  const setParams = useSetSearchParams();

  const nowDate = now();
  const monthAgo = subMonths(nowDate, 1);

  const lifeAspectId = searchParams.get("lifeAspectId");

  const selectedLifeAspect = useLifeAspectById(
    lifeAspectId ? Number(lifeAspectId) : null
  );

  const icon = useLifeAspectAssetIcon(selectedLifeAspect?.id);

  const habits = useHabitsByLifeAspectId(selectedLifeAspect?.id);

  if (!selectedLifeAspect) {
    return null;
  }

  const allLogs = [
    ...selectedLifeAspect.boosts,
    ...habits
      .map((h) => h.logs)
      .flat()
      .filter((log) => compareAsc(log.created_at, monthAgo) > 0),
  ].sort((a, b) => compareDesc(a.created_at, b.created_at));

  const { Component: AssetComponent, viewBox } =
    ASPECT_TO_ASSET_MAP[selectedLifeAspect.asset];

  // const treeLifeAspect = lifeAspects.find((la) => la.asset === "tree");

  const assetScore = Math.floor(
    getHabitProgressForLifeAspect(habits, selectedLifeAspect || [], true) / 10
  );

  return (
    <Sheet open>
      <SheetContent
        side="right"
        aria-describedby="Task info"
        onCloseClick={() => setParams("lifeAspectId", null)}
        onEscapeKeyDown={() => setParams("lifeAspectId", null)}
      >
        <SheetHeader>
          <SheetTitle>{selectedLifeAspect.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 w-full h-[20%] border border-[4px] border-dotted flex items-baseline justify-center text-4xl">
          <AssetComponent
            stage={assetScore}
            withBoosts={false}
            viewBox={viewBox}
            className="h-full w-auto"
          />
          {icon}
        </div>
        <div className="mt-4 p-4 pl-0 w-full h-[30%] border border-[4px] border-dotted">
          <LifeAspectBarChart lifeAspectId={selectedLifeAspect.id} />
        </div>
        <ScrollArea className="h-[40%] mt-4 border border-[4px] border-dotted">
          <table className="w-full text-2 text-xs [&_tr:first-child_td]:border-t-0 [&_tr:last-child_td]:border-b-0">
            {allLogs.map((generalLog, idx) =>
              "source_type" in generalLog ? (
                <BoostEntry
                  key={`${generalLog.id}-${idx}`}
                  boost={generalLog}
                />
              ) : (
                <LogEntry key={`${generalLog.id}-${idx}`} log={generalLog} />
              )
            )}
          </table>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
