"use client";

import { lightFormat, format } from "date-fns";
import React, { FC, ReactNode } from "react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { Task } from "@/models/task";
import useEvents from "@/app/utils/hooks/use-events";
import { cn } from "../utils";
import styles from "./TodayEvent.module.scss";
import { updateObjById } from "@/app/utils/common/update-array";
import { Badge } from "../ui/badge";

export interface TodayEventProps {
  testId?: string;
  start?: Date;
  end?: Date;
  title: ReactNode | string;
  completed: boolean;
  allDay?: boolean;
  id: string;
  showDate?: boolean;
  type: "deadline" | "event";
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
  type,
}): JSX.Element => {
  const { setData } = useEvents();

  const handleCompleteClick = async (val: boolean) => {
    await axios.patch<Task, { data: Task }>("/api/tasks/events", {
      taskId: id,
      completed: val,
    });

    setData((events) => updateObjById<Task>(events, id, { completed: val }));
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
      <div>
        {title}
        {type === "deadline" && (
          <Badge
            className="ml-4"
            variant={completed ? "secondary" : "destructive"}
          >
            Deadline
          </Badge>
        )}
      </div>

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
