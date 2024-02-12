"use client";

import { lightFormat, format } from "date-fns";
import React, { FC, ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { ITask } from "@/models/task";
import useEvents from "@/app/utils/hooks/use-events";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import { updateObjById } from "@/app/utils/common/update-array";
import { ObjectId } from "mongoose";

export interface TodayEventProps {
  testId?: string;
  start?: Date;
  end?: Date;
  title: ReactNode | string;
  completed: boolean;
  allDay?: boolean;
  id: ObjectId;
  showDate?: boolean;
}

const TodayEvent: FC<TodayEventProps> = ({
  testId,
  allDay,
  title,
  start,
  end,
  completed,
  id,
  showDate,
}): JSX.Element => {
  const { setData } = useEvents();

  const handleCompleteClick = async (val: boolean) => {
    await axios.patch<ITask, { data: ITask }>("/api/tasks/events", {
      taskId: id,
      completed: val,
    });

    setData((events) => updateObjById<ITask>(events, id, { completed: val }));
  };

  return (
    <div
      className={cn([
        "grid grid-cols-3 gap-4 italic mt-4",
        completed ? "text-muted-foreground" : "",
        completed ? styles.container : "",
      ])}
      data-testid={testId}
    >
      {allDay ? (
        <div className="flex">All Day</div>
      ) : (
        <div className="flex">
          {start && showDate && <div>{format(start, "MMM d, EEEEE")}</div>}
          {start && end && (
            <div>
              {lightFormat(start, "H:mm")}-{lightFormat(end, "H:mm")}
            </div>
          )}
        </div>
      )}
      <div>{title}</div>
      <div className="flex justify-end self-center">
        <Checkbox
          checked={completed}
          onCheckedChange={handleCompleteClick}
          variant={completed ? "secondary" : "default"}
        />
      </div>
    </div>
  );
};

export default TodayEvent;
