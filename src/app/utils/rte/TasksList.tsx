import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { MentionsConfigProps } from "./types";
import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import { ITask, TaskStatus } from "../types/task";
import { useTasksNewActions } from "../hooks/use-tasks-new/actions-context";
import { useActiveTasks } from "../hooks/use-tasks-new/selectors";
import { useTaskProjectColor } from "../hooks/use-projects/selectors";
import { IconCalendar, IconProgressCheck } from "@tabler/icons-react";

export type TasksListProps = MentionsConfigProps;

const TaskListItem: FC<{
  task: ITask;
  selected?: boolean;
  onSelect(): void;
}> = ({ task, selected, onSelect }) => {
  const color = useTaskProjectColor(task);

  return (
    <div key={task.id}>
      <Badge
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        color={color?.main || "#fff"}
        className={selected ? "font-extrabold" : "font-normal"}
      >
        {task.title}
        {task.event_id && <IconCalendar size={12} className="ml-2" />}
        {task.status === TaskStatus.Doing && (
          <IconProgressCheck size={12} className="ml-2" />
        )}
      </Badge>
    </div>
  );
};

export const TasksList = forwardRef(
  ({ command, query }: TasksListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const tasks = useActiveTasks();
    const { createTask } = useTasksNewActions();

    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    const handleAddTask = async (title: string) => {
      const createdTask = await createTask({ title });
      if (createdTask) {
        command({
          id: `${createdTask.id}`,
          label: createdTask.title,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    const filteredItems = tasks
      .filter((task) =>
        task.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const items = [...filteredItems, { id: -1, title: query }];

    const selectItem = (index: number) => {
      const item = items[index];

      if (item.id !== -1) {
        command({
          id: `${item.id}`,
          label: item.title,
        });
      } else {
        handleAddTask(query);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    return (
      <Card>
        <CardContent className="py-2 px-4">
          {items.map(
            (task: ITask | { id: number; title: string }, index: number) => {
              if (task.id === -1 && !query) return null;
              if (task.id === -1) {
                return (
                  <div key={task.id}>
                    Create:
                    <Badge
                      variant={selectedIndex === index ? "default" : "outline"}
                      onClick={() => selectItem(index)}
                    >
                      {task.title}
                    </Badge>
                  </div>
                );
              }
              return (
                <TaskListItem
                  key={task.id}
                  selected={selectedIndex === index}
                  onSelect={() => selectItem(index)}
                  task={task as ITask}
                />
              );
            }
          )}
        </CardContent>
      </Card>
    );
  }
);

TasksList.displayName = "TaskList";
