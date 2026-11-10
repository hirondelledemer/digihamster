"use client";

import { FC } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useSearchParams } from "next/navigation";
import { useSetSearchParams } from "@/app/utils/url/search-params";
import {
  useLifeAspectAssetIcon,
  useLifeAspectById,
} from "@/app/utils/hooks/use-life-aspects/selectors";
import { LifeAspectBarChart } from "./LifeAspectBarChart";
import { useHabitsByLifeAspectId } from "@/app/utils/hooks/use-habits-new/selectors";
import { ScrollArea } from "../ui/scroll-area";
import { compareAsc, compareDesc, subMonths } from "date-fns";
import { now } from "@/app/utils/date/now";
import { getHabitProgressForLifeAspect } from "@/app/utils/habits/habit-progress";
import { ASPECT_TO_ASSET_MAP } from "./contants";
import { BoostEntry } from "./components/BoostEntry";
import { HabitEntry } from "./components/HabitEntry";

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
                <HabitEntry key={`${generalLog.id}-${idx}`} log={generalLog} />
              )
            )}
          </table>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
