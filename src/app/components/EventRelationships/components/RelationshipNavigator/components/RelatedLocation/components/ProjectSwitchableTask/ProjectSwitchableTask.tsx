import TaskCard from "@/app/components/TaskCard";
import { useActiveTasksForProject } from "@/app/utils/hooks/use-tasks/selectors";
import { IProject } from "@/app/utils/types/project";
import { Button } from "@base-ui/react";
import { IconArrowBadgeLeft, IconArrowBadgeRight } from "@tabler/icons-react";
import { FC, useState } from "react";

export const ProjectSwitchableTask: FC<{ project: IProject }> = ({
  project,
}) => {
  const tasks = useActiveTasksForProject(project.id);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);

  const handleRightClick = () => {
    if (activeTaskIndex === tasks.length - 1) {
      return;
    }

    setActiveTaskIndex((val) => val + 1);
  };

  const handleLeftClick = () => {
    if (activeTaskIndex === 0) {
      return;
    }

    setActiveTaskIndex((val) => val - 1);
  };

  return (
    <div className="group">
      <div className="flex gap-2 items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0  duration-200 ease-out">
        <Button onClick={handleLeftClick}>
          <IconArrowBadgeLeft color={project.color} size={16} />
        </Button>
        <div className="text-xs">
          {activeTaskIndex + 1} / {tasks.length}
        </div>
        <Button onClick={handleRightClick}>
          <IconArrowBadgeRight color={project.color} size={16} />
        </Button>
      </div>
      <TaskCard task={tasks[activeTaskIndex]} />
    </div>
  );
};
