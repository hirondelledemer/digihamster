import React, { FC, useState } from "react";

import { TaskWithRelatedTasks } from "@/app/utils/types/task";
import TaskCard from "../TaskCard";
import { IconCornerDownRight } from "@tabler/icons-react";

export interface TaskWithRelationsProps {
  task: TaskWithRelatedTasks;
  testId?: string;
}

const TaskWithRelations: FC<TaskWithRelationsProps> = ({
  task,
  testId,
}): JSX.Element => {
  const [isRelatedTasksOpen, setIsRelatedTasksOpen] = useState<boolean>(false);

  const relatedTasksCta = !!task.relatedTasks.length
    ? {
        label: `${task.relatedTasks.length} related tasks`,
        onClick: () => setIsRelatedTasksOpen((val) => !val),
      }
    : undefined;
  return (
    <div data-testid={testId}>
      <TaskCard
        task={task}
        relatedTasksCta={relatedTasksCta}
        dragId={task._id}
      />
      {isRelatedTasksOpen && (
        <div className="flex flex-col gap-1 mt-1 animate-fade">
          {task.relatedTasks.map((rTask) => (
            <div key={`${task._id}-${rTask._id}`} className="flex gap-1">
              <div className="flex items-center">
                {/* todo: change color */}
                <IconCornerDownRight color="#7b7b86" />
              </div>
              <div className="grow">
                <TaskCard task={rTask} dragId={`${task._id}-${rTask._id}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskWithRelations;
