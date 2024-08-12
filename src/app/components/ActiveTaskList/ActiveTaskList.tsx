"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC, useEffect, useMemo, useState } from "react";
import TaskCard from "../TaskCard";
import useTasks from "@/app/utils/hooks/use-tasks";

import { ScrollArea } from "../ui/scroll-area";
import { unique } from "remeda";
import useTags from "@/app/utils/hooks/use-tags";
import TagsFilter from "./TagsFilter";

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

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredTasks = useMemo(
    () =>
      tasksToShow.filter((task) => {
        if (!task.tags.length) {
          return true;
        }
        return !!task.tags.find((tagId) => selectedTags.includes(tagId))
          ?.length;
      }),
    [selectedTags, tasksToShow]
  );

  useEffect(() => {
    setSelectedTags(usedTagIds);
  }, [usedTagIds]);

  const usedTags = useMemo(
    () => tags.filter((tag) => usedTagIds.includes(tag._id)),
    [tags, usedTagIds]
  );

  return (
    <div data-testid={testId}>
      <div className="w-[350px]">
        <TagsFilter
          tags={usedTags}
          selectedTagIds={selectedTags}
          onSelectedTagsIdsChange={setSelectedTags}
        />
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
