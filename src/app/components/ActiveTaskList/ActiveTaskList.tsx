"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC, useEffect, useMemo, useState } from "react";
import TaskCard from "../TaskCard";
import useTasks from "@/app/utils/hooks/use-tasks";

import { ScrollArea } from "../ui/scroll-area";
import { unique } from "remeda";
import useTags from "@/app/utils/hooks/use-tags";
import TagsFilter from "./TagsFilter";
import {
  IconCircle,
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { TaskV2 } from "@/models/taskV2";

export const taskTestId = "ActiveTaskList-task-testid";

export interface ActiveTaskListProps {
  testId?: string;
}

const addEstimates = (acc: number, val: TaskV2): number =>
  acc + (val.estimate || 0);

const ActiveTaskList: FC<ActiveTaskListProps> = ({
  testId,
}): JSX.Element | null => {
  const { data: tasks } = useTasks();
  const { data: tags } = useTags();

  const tasksToShow = useMemo(
    () =>
      tasks
        .filter((task) => task.isActive || (task.deadline && !task.completed))
        .sort((a, b) => (a.estimate || 0) - (b.estimate || 0))
        .sort((a, b) =>
          a.completed === b.completed ? 0 : a.completed ? 1 : -1
        ),
    [tasks]
  );

  const usedTagIds = useMemo(
    () => unique(tasksToShow.map((task) => task.tags).flat()),
    [tasksToShow]
  );

  const [tagsToExclude, setTagsToExclude] = useState<string[]>([]);

  const filteredTasks = useMemo(
    () =>
      tasksToShow.filter((task) => {
        return !task.tags.find((tagId) => tagsToExclude.includes(tagId))
          ?.length;
      }),
    [tagsToExclude, tasksToShow]
  );

  const usedTags = useMemo(
    () => tags.filter((tag) => usedTagIds.includes(tag._id)),
    [tags, usedTagIds]
  );

  const pendingTasksCount = useMemo(
    () => filteredTasks.filter((t) => !t.completed).reduce(addEstimates, 0),
    [filteredTasks]
  );

  const completedTasksCount = useMemo(
    () => filteredTasks.filter((t) => t.completed).reduce(addEstimates, 0),
    [filteredTasks]
  );

  return (
    <div data-testid={testId}>
      <div className="w-[350px]">
        <TagsFilter
          tags={usedTags}
          selectedTagIds={tagsToExclude}
          onSelectedTagsIdsChange={setTagsToExclude}
        />
      </div>
      <div className="text-sm flex items-center mb-3 space-x-2">
        <IconCircle size={16} color="#eab308" className="mr-1" />
        {pendingTasksCount}
        <IconCircleCheck
          size={19}
          color="black"
          fill="green"
          className="mr-1"
        />
        {completedTasksCount}
      </div>
      <ScrollArea className="h-screen">
        <div className="pr-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              testId={taskTestId}
              task={task}
              className="mb-4"
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveTaskList;
