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
import { ILocation } from "../types/location";
import { useLocationsState } from "../hooks/use-location/state-context";

export type LocationListProps = MentionsConfigProps;

export const LocationList = forwardRef(
  ({ command, query }: LocationListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { data: locations } = useLocationsState();

    useEffect(() => {
      setSelectedIndex(0);
    }, [locations]);

    const handleAddLocation = async (title: string) => {
      // todo: handle error
      // TODO: use hook
      const response = await apiClient.post<unknown, { data: ILocation }>(
        "/locations",
        {
          title,
          color:
            locations.length < COLORS_V2.length
              ? COLORS_V2[locations.length]
              : COLORS_V2[getRandomInt(COLORS_V2.length)],
        }
      );

      command({
        id: `${response.data.id}:${response.data.color}`,
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

    const items = locations
      .filter((location) =>
        location.title.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item.id}:${item.color}`,
          label: item.title,
        });
      } else {
        handleAddLocation(query);
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
            items.map((location: ILocation, index: number) => (
              <div key={location.id}>
                <Badge
                  variant={selectedIndex === index ? "default" : "outline"}
                  onClick={() => selectItem(index)}
                  color={colorMapper[location.color]}
                >
                  {location.title}
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

LocationList.displayName = "MentionList";
