"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC, useMemo, useState } from "react";

import useTasks from "@/app/utils/hooks/use-tasks";

import { ScrollArea } from "../ui/scroll-area";
import { unique } from "remeda";
import useTags from "@/app/utils/hooks/use-tags";
import TagsFilter from "./TagsFilter";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";
import TaskCard from "../TaskCard";

export const taskTestId = "ActiveTaskList-task-testid";

export interface ActiveTaskListProps {
  testId?: string;
}

const ActiveTaskList: FC<ActiveTaskListProps> = ({
  testId,
}): JSX.Element | null => {
  const { data: tasks } = useTasks();
  const { data: tags } = useTags();

  const tasksToShow = useMemo(
    () =>
      tasks
        .filter((task) => task.isActive && !task.deadline && !task.eventId)
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
    () => filteredTasks.filter((t) => !t.completed).length,
    [filteredTasks]
  );

  const completedTasksCount = useMemo(
    () => filteredTasks.filter((t) => t.completed).length,
    [filteredTasks]
  );

  return (
    <div data-testid={testId} className="w-full h-full">
      <div>
        <TagsFilter
          tags={usedTags}
          selectedTagIds={tagsToExclude}
          onSelectedTagsIdsChange={setTagsToExclude}
        />
      </div>
      <div className="text-sm flex items-center mb-3 space-x-2">
        <IconCircle size={16} color="green" className="mr-1" />
        {pendingTasksCount}
        <IconCircleCheck
          size={19}
          color="black"
          fill="green"
          className="mr-1"
        />
        {completedTasksCount}
      </div>
      <ScrollArea className="h-full pb-[60px]">
        <div className="flex flex-col gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              dragId={task._id}
              key={task._id}
              task={task}
              testId={taskTestId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveTaskList;
