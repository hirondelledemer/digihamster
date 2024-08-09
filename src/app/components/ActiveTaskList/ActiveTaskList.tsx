"use client";
//todo: make this component server. need to rethink how it gets its data

import React, { FC } from "react";
import TaskCard from "../TaskCard";
import useTasks from "@/app/utils/hooks/use-tasks";

import { ScrollArea } from "../ui/scroll-area";
import { unique } from "remeda";
import { Badge } from "../ui/badge";
import useTags from "@/app/utils/hooks/use-tags";

export const taskTestId = "ActiveTaskList-task-testid";

export interface ActiveTaskListProps {
  testId?: string;
}

const ActiveTaskList: FC<ActiveTaskListProps> = ({ testId }): JSX.Element => {
  const { data: tasks } = useTasks();
  const { data: tags } = useTags();
  const tasksToShow = tasks
    .filter((task) => task.isActive || (task.deadline && !task.completed))
    .sort((a, b) => (a.estimate || 0) - (b.estimate || 0))
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  const usedTagIds = unique(tasksToShow.map((task) => task.tags).flat());
  const usedTags = tags.filter((tag) => usedTagIds.includes(tag._id));

  console.log(usedTags);
  return (
    <div data-testid={testId}>
      {usedTags.map((tag) => (
        <Badge variant="outline" key={tag._id}>
          {tag.title}
        </Badge>
      ))}
      <ScrollArea className="h-screen">
        <div className="pr-6">
          {tasksToShow.map((task) => (
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
