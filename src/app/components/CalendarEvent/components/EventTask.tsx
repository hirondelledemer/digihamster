import {
  useTaskProject,
  useTaskProjectColor,
} from "@/app/utils/hooks/use-projects/selectors";
import { ITask, TaskStatus } from "@/app/utils/types/task";
import { FC } from "react";
import { cn } from "../../utils";
import { Checkbox } from "../../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { useRouter } from "next/navigation";

interface EventTaskProps {
  task: ITask;
  onCompletedChange: (value: CheckedState) => void;
}

export const EventTask: FC<EventTaskProps> = ({ task, onCompletedChange }) => {
  const projectColor = useTaskProjectColor(task);
  const project = useTaskProject(task);
  const router = useRouter();

  return (
    <div
      className={cn(
        "text-sm mt-1 border bg-card rounded-md p-1 flex items-center gap-2",
      )}
      style={{
        background: projectColor?.dimmed,
      }}
    >
      <Checkbox
        checked={task.status === TaskStatus.Done}
        onCheckedChange={onCompletedChange}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDownCapture={(event) => {
          // the calendar listens for mousedown natively to start a
          // slot selection, so it has to be stopped in the capture phase
          event.stopPropagation();
        }}
      />
      {project && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger
              className="pointer-events-auto"
              onMouseDownCapture={(e) => {
                // the calendar starts a slot selection on a native mousedown
                e.stopPropagation();
              }}
            >
              <div
                style={{
                  background: projectColor?.main,
                }}
                className="h-4 w-4 cursor"
                onClick={() =>
                  router.push(`/?projectId=${project.id}`, undefined)
                }
              />
            </TooltipTrigger>
            <TooltipContent>{project.title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {task.title}
    </div>
  );
};
