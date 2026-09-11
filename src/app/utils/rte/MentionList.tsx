import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { COLORS_V2, colorMapper } from "../consts/colors";
import { getRandomInt } from "../common/random-int";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { MentionsConfigProps } from "./types";
import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import apiClient from "../api-client";
import { usePeopleState } from "../hooks/use-people/state-context";
import { IPerson } from "../types/person";

export type MentionListProps = MentionsConfigProps;

export const MentionList = forwardRef(
  ({ command, query }: MentionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: people } = usePeopleState();

    useEffect(() => {
      setSelectedIndex(0);
    }, [people]);

    const handleAddPerson = async (name: string) => {
      // todo: handle error
      // TODO: use hook
      const response = await apiClient.post<unknown, { data: IPerson }>(
        "/people",
        {
          name,
          color:
            people.length < COLORS_V2.length
              ? COLORS_V2[people.length]
              : COLORS_V2[getRandomInt(COLORS_V2.length)],
        }
      );

      command({
        id: `${response.data.id}:${response.data.color}`,
        label: response.data.name,
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

    const items = people
      .filter((person) =>
        person.name.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item.id}:${item.color}`,
          label: item.name,
        });
      } else {
        handleAddPerson(query);
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
            items.map((person: IPerson, index: number) => (
              <div key={person.id}>
                <Badge
                  variant={selectedIndex === index ? "default" : "outline"}
                  onClick={() => selectItem(index)}
                  color={colorMapper[person.color]}
                >
                  {person.name}
                </Badge>
              </div>
            ))
          ) : (
            <Button>{`Create"${query}"`}</Button>
          )}
        </CardContent>
      </Card>
    );
  }
);

MentionList.displayName = "MentionList";
