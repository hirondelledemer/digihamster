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

import { useHabitsNewState } from "../hooks/use-habits-new/state-context";
import { IHabitWithLogs } from "../types/habit";

export type HabitsListProps = MentionsConfigProps;

const HabitListItem: FC<{
  habit: IHabitWithLogs;
  selected?: boolean;
  onSelect(): void;
}> = ({ habit, selected, onSelect }) => {
  return (
    <div key={habit.id}>
      <Badge
        variant={selected ? "default" : "outline"}
        onClick={onSelect}
        className={selected ? "font-extrabold" : "font-normal"}
      >
        {habit.title}
      </Badge>
    </div>
  );
};

export const HabitsList = forwardRef(
  ({ command, query }: HabitsListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: habits } = useHabitsNewState();

    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

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

    const items = habits
      .filter((habit) =>
        habit.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];
      command({
        id: `${item.id}`,
        label: item.title,
      });
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
          {items.map((habit: IHabitWithLogs, index: number) => {
            // if (habit.id === -1 && !query) return null;
            // if (habit.id === -1) {
            //   return (
            //     <div key={habit.id}>
            //       Create:
            //       <Badge
            //         variant={selectedIndex === index ? "default" : "outline"}
            //         onClick={() => selectItem(index)}
            //       >
            //         {habit.title}
            //       </Badge>
            //     </div>
            //   );
            // }
            return (
              <HabitListItem
                key={habit.id}
                selected={selectedIndex === index}
                onSelect={() => selectItem(index)}
                habit={habit}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

HabitsList.displayName = "TaskList";
