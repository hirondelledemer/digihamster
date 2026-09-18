import React, { FC } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

import { IHabitWithLogs } from "@/app/utils/types/habit";
import { getHabitLogForADay } from "@/app/utils/habits/habit-log";
import { IEvent } from "@/app/utils/types/event";
import { HabitActions } from "./HabitActions";
import { useHabitLifeAspectAssetIcon } from "@/app/utils/hooks/use-life-aspects/selectors";

export const titleTestId = "TaskCard-title-testid";
export const cardTestId = "TaskCard-card-testid";

export interface HabitCardProps {
  habit: IHabitWithLogs;
  event: IEvent;
}

export const HabitCard: FC<HabitCardProps> = ({
  habit,
  event,
}): JSX.Element => {
  const date = new Date(event.start_at);
  const log = getHabitLogForADay(habit, date);
  const isCompleted = log?.completed;
  const icon = useHabitLifeAspectAssetIcon(habit);

  return (
    <div>
      <HabitActions habit={habit} event={event}>
        <Card
          data-testid={cardTestId}
          className={`p-0 rounded-md ${
            isCompleted ? "opacity-40 line-through" : ""
          }`}
        >
          <CardHeader className="p-4 pt-2">
            <CardTitle
              data-testid={titleTestId}
              className="font-normal flex items-center justify-between"
            >
              <div>
                {icon} {habit.title}
              </div>
            </CardTitle>
            {/* <CardContent /> */}
          </CardHeader>
        </Card>
      </HabitActions>
    </div>
  );
};
