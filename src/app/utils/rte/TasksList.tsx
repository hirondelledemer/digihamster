import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { MentionsConfigProps } from "./types";
import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import apiClient from "../api-client";
import { useTasksNewState } from "../hooks/use-tasks-new/state-context";
import { ITask } from "../types/task";

export type TasksListProps = MentionsConfigProps;

export const TasksList = forwardRef(
  ({ command, query }: TasksListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: tasks } = useTasksNewState();

    useEffect(() => {
      setSelectedIndex(0);
    }, [tasks]);

    const handleAddTag = async (title: string) => {
      // todo: handle error
      // TODO: use hook
      const response = await apiClient.post<unknown, { data: ITask }>(
        "/tasks",
        {
          title,
        },
      );

      command({
        id: `${response.data.id}`,
        label: response.data.title,
      });
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

    const items = tasks
      .filter((task) =>
        task.title.toLowerCase().startsWith(query.toLowerCase()),
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item.id}`,
          label: item.title,
        });
      } else {
        handleAddTag(query);
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
          {items.length ? (
            items.map((task: ITask, index: number) => (
              <div key={task.id}>
                <Badge
                  variant={selectedIndex === index ? "default" : "outline"}
                  onClick={() => selectItem(index)}
                >
                  {task.title}
                </Badge>
              </div>
            ))
          ) : (
            <Button>{`Create"${query}"`}</Button>
          )}
        </CardContent>
      </Card>
    );
  },
);

TasksList.displayName = "TaskList";
