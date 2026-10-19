import TaskCard from "@/app/components/TaskCard";
import { useActiveTasksForProject } from "@/app/utils/hooks/use-tasks/selectors";
import { IProject } from "@/app/utils/types/project";
import { Button } from "@base-ui/react";
import { IconArrowBadgeLeft, IconArrowBadgeRight } from "@tabler/icons-react";
import { FC, useState } from "react";
import { useEventScheduling } from "@/app/components/EventRelationships/use-event-scheduling";
import { RelationshipEntityType } from "@/app/utils/types/relationship";

export const ProjectSwitchableTask: FC<{ project: IProject }> = ({
  project,
}) => {
  const tasks = useActiveTasksForProject(project.id);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);

  // completing a task shortens the list under the index you are parked on, so
  // the position has to be read back as "as far along as there is", not as
  // whatever the arrows last set
  const index = Math.min(activeTaskIndex, tasks.length - 1);
  const activeTask = tasks[index];
  const { scheduled, actions } = useEventScheduling(
    RelationshipEntityType.Task,
    activeTask?.id
  );

  const handleRightClick = () => {
    if (index === tasks.length - 1) {
      return;
    }

    setActiveTaskIndex(index + 1);
  };

  const handleLeftClick = () => {
    if (index === 0) {
      return;
    }

    setActiveTaskIndex(index - 1);
  };

  // a project whose tasks are all done has nothing to switch between
  if (!activeTask) {
    return null;
  }

  return (
    <div className="group">
      <div className="flex gap-2 items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0  duration-200 ease-out">
        <Button onClick={handleLeftClick}>
          <IconArrowBadgeLeft color={project.color} size={16} />
        </Button>
        <div className="text-xs">
          {index + 1} / {tasks.length}
        </div>
        <Button onClick={handleRightClick}>
          <IconArrowBadgeRight color={project.color} size={16} />
        </Button>
      </div>
      <TaskCard
        task={activeTask}
        scheduled={scheduled}
        additionalActions={actions}
      />
    </div>
  );
};
