import React, { FC } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

import { IHabitWithLogs } from "@/app/utils/types/habit";
import { getHabitLogForADay } from "@/app/utils/habits/habit-log";
import { IEvent } from "@/app/utils/types/event";
import { HabitActions } from "./HabitActions";
import { AdditionalAction } from "../AdditionalActions";
import { ScheduledIndicator } from "../ScheduledIndicator";
import {
  getLifeAspectAssetIcon,
  useHabitLifeAspect,
} from "@/app/utils/hooks/use-life-aspects/selectors";
import { useHabitWindow } from "@/app/utils/hooks/use-habits-new/selectors";
import { HabitProgress } from "./HabitProgress";
import { useSetSearchParams } from "@/app/utils/url/search-params";
import { QUERY_KEYS } from "@/app/utils/url/constants";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface HabitCardProps {
  habit: IHabitWithLogs;
  event: IEvent;
  additionalActions?: AdditionalAction[];
  /** the habit is already attached to the event being looked at */
  scheduled?: boolean;
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  event,
  additionalActions,
  scheduled,
}): JSX.Element => {
  const date = new Date(event.start_at);
  const log = getHabitLogForADay(habit, date);
  const isCompleted = log?.completed;
  const lifeAspect = useHabitLifeAspect(habit);
  const icon = getLifeAspectAssetIcon(lifeAspect?.asset);
  const habitWindow = useHabitWindow(habit.id);
  const setParams = useSetSearchParams();

  return (
    <div className="w-full">
      <HabitActions
        habit={habit}
        event={event}
        additionalActions={additionalActions}
      >
        <Card
          data-testid={cardTestId}
          className={`p-0 rounded-md ${
            isCompleted ? "opacity-40 line-through" : ""
          }`}
        >
          <CardHeader className="p-4 pt-2 gap-2">
            <CardTitle
              data-testid={titleTestId}
              className="font-normal flex items-center justify-between"
            >
              <div className="flex gap-1">
                <div
                  className="hover:animate-wiggle cursor-pointer"
                  onClick={() =>
                    lifeAspect &&
                    setParams(QUERY_KEYS.lifeAspect, lifeAspect?.id.toString())
                  }
                >
                  {icon}
                </div>
                {habit.title}
              </div>
              {scheduled && <ScheduledIndicator />}
            </CardTitle>
            {/* the bar says where the habit stands overall, which is a
                different question from the line-through above - that is only
                about this one occurrence */}
            {!!habitWindow && <HabitProgress habitWindow={habitWindow} />}
          </CardHeader>
        </Card>
      </HabitActions>
    </div>
  );
};
