import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { COLORS_V2, colorMapper } from "../consts/colors";
import { getRandomInt } from "../common/random-int";
import axios from "axios";
import { ITag } from "@/models/tag";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export interface MentionListProps {
  command: any;
  query: string;
}

export const MentionList = forwardRef(
  ({ command, query }: MentionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [tags, setTags] = useState<ITag[]>([]);

    useEffect(() => {
      (async function () {
        try {
          const tagsResponse = await axios.get<ITag[]>("/api/tags");
          setTags(tagsResponse.data);
        } catch (err) {
          // setError(err);
          //todo: show error
        }
      })();
    }, []);

    useEffect(() => {
      setSelectedIndex(0);
    }, [tags]);

    const handleAddTag = async (title: string) => {
      // todo: handle error
      const response = await axios.post<any, { data: ITag }>("/api/tags", {
        title,
        color:
          tags.length < COLORS_V2.length
            ? COLORS_V2[tags.length]
            : COLORS_V2[getRandomInt(COLORS_V2.length)],
      });

      command({
        id: `${response.data._id}:${response.data.color}`,
        label: response.data.title,
      });
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: any) => {
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

    const items = tags
      .filter((tag) => tag.title.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({
          id: `${item._id}:${item.color}`,
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
            items.map((tag: ITag, index: number) => (
              <div key={tag._id}>
                <Badge
                  variant={selectedIndex === index ? "default" : "outline"}
                  onClick={() => selectItem(index)}
                  color={colorMapper[tag.color]}
                >
                  {tag.title}
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
